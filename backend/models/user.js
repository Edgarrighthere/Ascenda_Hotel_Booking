const db=require("./db.js"); 
const collectionName="Users";

const userSchema = new db.mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    salutation: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    countryCode: { type: String, required: true },
    phoneNumber: { type: String, unique: true, required: true },
    otp: String, 
    otpExpiration: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date
});


const UsersCollection = db.mongoose.model(collectionName, userSchema);


module.exports = {UsersCollection, userSchema};