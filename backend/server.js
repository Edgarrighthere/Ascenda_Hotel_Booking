const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    credentials: true,
}));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/validUsers', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Check connection
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    otp: String, 
    otpExpiration: Date 
});

const User = mongoose.model('User', userSchema);

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'escc2g4@gmail.com',
        pass: 'gkgf gafp inmm zfwm'
    }
});

// Register route
app.post('/register', async (req, res) => {
    const { email, username, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists. Please log in." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            username,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: "User successfully created. Please log in." });
    } catch (error) {
        res.status(500).json({ message: "An error occurred. Please try again." });
    }
});

// Login route
app.post("/login", async (req, res) => {
    const { identifier, password } = req.body;

    try {
        const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
        if (!user) {
            return res.status(400).json({ message: "Invalid email/username." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password." });
        }

        // Generate OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        user.otp = otp;
        user.otpExpiration = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
        await user.save();

        // Send OTP email
        const mailOptions = {
            from: 'escc2g4@gmail.com',
            to: user.email,
            subject: "Your OTP Code",
            text: `Your OTP code is ${otp}. It is valid for 10 minutes.`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Login successful. Verify with the OTP sent to your registered email...", email: user.email });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "An error occurred. Please try again." });
    }
});

// Verify OTP route
app.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email, otp, otpExpiration: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid OTP or OTP expired." });
        }

        // Clear OTP after successful verification
        user.otp = undefined;
        user.otpExpiration = undefined;
        await user.save();

        res.status(200).json({ success: true, message: "OTP verified successfully." });
    } catch (error) {
        console.error("Error during OTP verification:", error);
        res.status(500).json({ success: false, message: "An error occurred. Please try again." });
    }
});

// Resend OTP route
app.post("/resend-otp", async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email." });
        }

        // Generate a new OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        user.otp = otp;
        user.otpExpiration = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
        await user.save();

        // Send OTP email
        const mailOptions = {
            from: 'escc2g4@gmail.com',
            to: user.email,
            subject: "Your OTP Code",
            text: `Your OTP code is ${otp}. It is valid for 10 minutes.`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: "OTP sent successfully." });
    } catch (error) {
        console.error("Error during OTP resend:", error);
        res.status(500).json({ success: false, message: "An error occurred. Please try again." });
    }
});

// Forgot password route
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email. Please try again.' });
        }

        // Generate reset password token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Send reset password email
        const resetUrl = `http://localhost:3000/resetPassword/${resetToken}`;
        const mailOptions = {
            from: 'escc2g4@gmail.com',
            to: user.email,
            subject: 'Reset Password',
            text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
                   Please click on the following link, or paste this into your browser to complete the process:\n\n
                   ${resetUrl}\n\n
                   If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Check your email for instructions to reset your password' });
    } catch (error) {
        console.error('Error during forgot password:', error);
        res.status(500).json({ message: 'Invalid email. Please try again.' });
    }
});

// Reset password route
app.post('/reset-password/:token', async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful.' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'An error occurred. Please try again.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
