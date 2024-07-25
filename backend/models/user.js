const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    salutation: String,
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
    // Other fields...
});

const User = mongoose.model('User', userSchema);

module.exports = User;
