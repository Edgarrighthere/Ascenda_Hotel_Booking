const mongoose = require('mongoose');

// Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/AscendaHotelBookingDB', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });
mongoose.connect('mongodb://localhost:27017/AscendaHotelBookingDB');

// Check connection
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});
 


module.exports = {mongoose};


