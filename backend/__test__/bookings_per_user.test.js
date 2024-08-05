const mongoose = require('mongoose');
const BookingEntry = require('../models/bookingsPerUser.js'); // Adjust the path as necessary

// Connect to a test database before running tests
beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/testDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clear the database after each test
afterEach(async () => {
  await BookingEntry.deleteMany({});
});

// Disconnect from the test database after all tests are done
afterAll(async () => {
  await mongoose.disconnect();
});

describe('BookingEntry Schema', () => {
  test('BACKEND_BOOKINGS_SCHEMA_1: should create a booking entry successfully', async () => {
    const bookingData = {
      email: 'test@example.com',
      session_id: '123456',
      bookingDetails: {
        leadGuest: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '1234567890',
        },
        specialRequests: 'Late check-out',
        roomType: 'Suite',
        roomOnlyPrice: 200,
        breakfastPrice: 50,
        cancelPolicy: 'Non-refundable',
      },
      searchDetails: {
        checkin: new Date(),
        checkout: new Date(),
        adults: 2,
        children: 1,
        rooms: 1,
        days: 3,
      },
      hotelDetails: {
        destination: 'New York',
        address: '1234 Broadway St',
        description: 'A luxurious suite in the heart of the city.',
        hotelName: 'Grand Hotel',
      },
    };

    const bookingEntry = new BookingEntry(bookingData);
    await bookingEntry.save();

    // Check if the document is saved correctly
    const foundEntry = await BookingEntry.findOne({ email: 'test@example.com' });
    expect(foundEntry).toBeTruthy();
    expect(foundEntry.email).toBe('test@example.com');
    expect(foundEntry.session_id).toBe('123456');
    expect(foundEntry.bookingDetails.leadGuest.firstName).toBe('John');
    expect(foundEntry.bookingDetails.roomOnlyPrice).toBe(200);
    expect(foundEntry.searchDetails.adults).toBe(2);
    expect(foundEntry.hotelDetails.destination).toBe('New York');
  });

  test('BACKEND_BOOKINGS_SCHEMA_2: should fail to create a booking entry without a required email', async () => {
    const bookingData = {
      session_id: '123456',
      bookingDetails: {
        leadGuest: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '1234567890',
        },
        specialRequests: 'Late check-out',
        roomType: 'Suite',
        roomOnlyPrice: 200,
        breakfastPrice: 50,
        cancelPolicy: 'Non-refundable',
      },
      searchDetails: {
        checkin: new Date(),
        checkout: new Date(),
        adults: 2,
        children: 1,
        rooms: 1,
        days: 3,
      },
      hotelDetails: {
        destination: 'New York',
        address: '1234 Broadway St',
        description: 'A luxurious suite in the heart of the city.',
        hotelName: 'Grand Hotel',
      },
    };

    try {
      const bookingEntry = new BookingEntry(bookingData);
      await bookingEntry.save();
    } catch (error) {
      expect(error.errors.email).toBeDefined();
      expect(error.errors.email.kind).toBe('required');
    }
  });

  test('BACKEND_BOOKINGS_SCHEMA_3: should enforce unique session_id', async () => {
    const bookingData1 = {
      email: 'test1@example.com',
      session_id: '123456',
      bookingDetails: {
        leadGuest: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '1234567890',
        },
        specialRequests: 'Late check-out',
        roomType: 'Suite',
        roomOnlyPrice: 200,
        breakfastPrice: 50,
        cancelPolicy: 'Non-refundable',
      },
      searchDetails: {
        checkin: new Date(),
        checkout: new Date(),
        adults: 2,
        children: 1,
        rooms: 1,
        days: 3,
      },
      hotelDetails: {
        destination: 'New York',
        address: '1234 Broadway St',
        description: 'A luxurious suite in the heart of the city.',
        hotelName: 'Grand Hotel',
      },
    };

    const bookingData2 = {
      email: 'test2@example.com',
      session_id: '123456', // Same session_id
      bookingDetails: {
        leadGuest: {
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@example.com',
          phone: '9876543210',
        },
        specialRequests: 'Non-smoking room',
        roomType: 'Standard',
        roomOnlyPrice: 100,
        breakfastPrice: 20,
        cancelPolicy: 'Refundable',
      },
      searchDetails: {
        checkin: new Date(),
        checkout: new Date(),
        adults: 1,
        children: 0,
        rooms: 1,
        days: 2,
      },
      hotelDetails: {
        destination: 'Los Angeles',
        address: '5678 Hollywood Blvd',
        description: 'A cozy room in the heart of Hollywood.',
        hotelName: 'Hollywood Inn',
      },
    };

    const bookingEntry1 = new BookingEntry(bookingData1);
    await bookingEntry1.save();

    try {
      const bookingEntry2 = new BookingEntry(bookingData2);
      await bookingEntry2.save();
    } catch (error) {
      expect(error.code).toBe(11000); // Duplicate key error
    }
  });

});
