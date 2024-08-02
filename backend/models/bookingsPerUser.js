const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    bookingDetails: {
        leadGuest: {
            firstName: String,
            lastName: String
        },
        specialRequests: String,
        roomType: String,
        roomPriceOnly: Number
    },
    searchDetails: {
        checkin: Date,
        checkout: Date,
        adults: Number,
        children: Number,
        rooms: Number
    }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
