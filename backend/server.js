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
    resetToken: String,
    resetTokenExpiration: Date
});

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

const User = mongoose.model('User', userSchema);

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

// login route
app.post("/login", async (req, res) => {
    const { identifier, password } = req.body;

    try {
        const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
        if (!user) {
            return res.status(400).json({ message: "Invalid email/username." });
        }

        if (!password) {
            return res.status(400).json({ message: "Invalid password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password." });
        }

        res.status(200).json({ message: "Login successful. Redirecting to home page..." });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "An error occurred. Please try again." });
    }
});

// forgot password route 
app.post("/forgotPassword", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Generate a secure token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiration = Date.now() + 3600000; // Token valid for 1 hour

        // Save the token and its expiration to the user document
        user.resetToken = resetToken;
        user.resetTokenExpiration = tokenExpiration;
        await user.save();

        const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

        // Send email
        const mailOptions = {
            from: "your-email@gmail.com",
            to: email,
            subject: "Password Reset",
            text: `Click the link to reset your password: ${resetUrl}`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Reset email sent successfully" });
    } catch (error) {
        console.error('Error in /forgotPassword route:', error);
        res.status(500).json({ message: "Error sending email", error });
    }
});

// reset password route
app.post("/resetPassword", async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required" });
    }

    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ message: "An error occurred. Please try again." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
