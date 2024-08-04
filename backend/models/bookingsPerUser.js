const mongoose = require('mongoose');
const db = require('./db.js'); // Adjust the path as necessary

const bookingEntrySchema = new mongoose.Schema({
    email: { type: String, required: true },
    session_id : {type: String, unique : true}, 
    bookingDetails: {
        leadGuest: {
            firstName: { type: String,  },
            lastName: { type: String,  },
            email: { type: String,  },
            phone: { type: String,  }
        },
        specialRequests: { type: String,  },
        roomType: { type: String,  },
        roomOnlyPrice: { type: Number,  },
        breakfastPrice: { type: Number,  },
        cancelPolicy: { type: String,  }
    },
    searchDetails: {
        checkin: { type: Date,  },
        checkout: { type: Date,  },
        adults: { type: Number,  },
        children: { type: Number,  },
        rooms: { type: Number,  },
        days: { type: Number,  }
    },
    hotelDetails: {
        destination: { type: String,  },
        address: { type: String,  },
        description: { type: String,  }
    }
}, { timestamps: true });

const BookingEntry = db.mongoose.model('BookingEntry', bookingEntrySchema);

module.exports = BookingEntry;
