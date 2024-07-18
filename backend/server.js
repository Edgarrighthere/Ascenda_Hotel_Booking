// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const process = require('process');

// const db = require("./models/db.js");

// process.on('SIGINT', db.mongoose.disconnect);
// process.on('SIGTERM', db.mongoose.disconnect);

// //Define routers
// var registerRouter = require("./routes/register.js");
// var loginRouter = require("./routes/login.js")
// var verifyOtpRouter = require("./routes/verify_otp.js");
// var resendOtpRouter = require("./routes/resend_otp.js");
// var forgotPasswordRouter = require("./routes/forgot_password.js");
// var resetPasswordRouter = require("./routes/reset_password.js");
// var checkoutRouter = require("./routes/checkout.js");
// var completePaymentRouter = require("./routes/complete_payment.js");


// const app = express();
// const PORT = process.env.PORT || 5001;

// // Middleware
// app.use(bodyParser.json());
// app.use(cors({
//     origin: 'http://localhost:3000', 
//     credentials: true,
// }));

// // Register route
// app.use("/register", registerRouter);

// // Login route
// app.use("/login", loginRouter);

// // Verify OTP route
// app.use("/verify_otp", verifyOtpRouter);

// // Resend OTP route
// app.use("/resend_otp", resendOtpRouter);

// // Forgot password route
// app.use("/forgot-password", forgotPasswordRouter);

// // Reset password route
// app.use("/reset-password", resetPasswordRouter);

// // Logout route
// app.post("/logout", (req, res) => {
//     res.status(200).json({ message: "Logout successful" });
// });

// // Create Stripe Checkout Session route
// app.use("/checkout", checkoutRouter);

// // complete payment 
// app.use("/complete", completePaymentRouter);

// // cancel payment -> return to hotels/:id page
// app.get('/cancel', (req, res) => {
//     res.redirect('/hotels');
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
