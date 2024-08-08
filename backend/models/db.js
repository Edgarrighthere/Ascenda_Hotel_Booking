const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/AscendaHotelBookingDB');
mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PW}@ascendacluster.kouwwun.mongodb.net/AscendaHotelBookingDB?retryWrites=true&w=majority&appName=AscendaCluster`)

// Check connection
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

module.exports = {mongoose};

// Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/AscendaHotelBookingDB', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });