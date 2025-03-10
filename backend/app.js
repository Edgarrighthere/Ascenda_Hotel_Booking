var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require("dotenv").config();

const bodyParser = require('body-parser');
const cors = require('cors');
const process = require('process');

const db = require("./models/db.js");

process.on('SIGINT', db.mongoose.disconnect);
process.on('SIGTERM', db.mongoose.disconnect);

//Define routers
var registerRouter = require("./routes/register.js");
var loginRouter = require("./routes/login.js")
var verifyOtpRouter = require("./routes/verify_otp.js");
var resendOtpRouter = require("./routes/resend_otp.js");
var forgotPasswordRouter = require("./routes/forgot_password.js");
var resetPasswordRouter = require("./routes/reset_password.js");
var checkoutRouter = require("./routes/checkout.js");
var completePaymentRouter = require("./routes/complete_payment.js");
var confirmationEmailRouter = require("./routes/confirmation_email.js")

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var destinationSearch = require('./routes/destination_search');
var destinationSearchRoute = destinationSearch.router;
var hotelSearch = require('./routes/hotel_search');
var hotelSearchRoute = hotelSearch.router;
var roomDetails = require('./routes/room_details')
var roomDetailsRoute = roomDetails.router;
var accountRouter = require('./routes/account.js')
var delAccRouter = require('./routes/send_delete_otp.js')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true,
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/destination_search', destinationSearchRoute);
app.use('/hotel_search', hotelSearchRoute);
app.use('/room_details', roomDetailsRoute);

// Register route
app.use("/register", registerRouter);

// Login route
app.use("/login", loginRouter);

// Verify OTP route
app.use("/verify_otp", verifyOtpRouter);

// Resend OTP route
app.use("/resend_otp", resendOtpRouter);

// Forgot password route
app.use("/forgot-password", forgotPasswordRouter);

// Reset password route
app.use("/reset-password", resetPasswordRouter);

// Account Info route
app.use("/account", accountRouter);

// Send Delete Account OTP route
app.use("/send_delete_otp", delAccRouter);

// Logout route
app.post("/logout", (req, res) => {
    res.status(200).json({ message: "Logout successful", resetUserInfo: true });
});

// Create Stripe Checkout Session route
app.use("/checkout", checkoutRouter);

// complete payment 
app.use("/complete", completePaymentRouter);

// send confirmation email
app.use("/confirmation_email", confirmationEmailRouter)

// cancel payment -> return to hotels/:id page
app.get('/cancel', (req, res) => {
    res.redirect('/hotels');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
 
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
