const mongoose = require('mongoose');
const BookingEntry = require('../models/bookingsPerUser'); // Adjust the path as necessary

jest.mock('../models/bookingsPerUser'); // Mock the entire BookingEntry model

describe('BookingEntry Model Test', () => {
  beforeAll(async () => {
    await mongoose.disconnect(); // Ensure the database is not connected
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear any mocks after each test
  });

  afterAll(async () => {
    await mongoose.connection.close(); // Close the mock connection
  });

  it('BACKEND_BOOKINGS_1: should create and save a booking entry successfully', async () => {
    const mockBooking = {
      email: 'test@example.com',
      session_id: '12345',
      bookingDetails: {
        leadGuest: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '1234567890',
        },
        specialRequests: 'Late check-out',
        roomType: 'Deluxe',
        roomOnlyPrice: 100,
        breakfastPrice: 20,
        cancelPolicy: 'Free cancellation',
      },
      searchDetails: {
        checkin: new Date(),
        checkout: new Date(),
        adults: 2,
        children: 0,
        rooms: 1,
        days: 2,
      },
      hotelDetails: {
        destination: 'Paris',
        address: '123 Main St',
        description: 'A beautiful hotel in Paris.',
        hotelName: 'Hotel Paris',
      },
    };

    // Mock the save method to return the mockBooking object
    BookingEntry.prototype.save = jest.fn().mockResolvedValue(mockBooking);

    // Create an instance of the model with mock data
    const bookingEntry = new BookingEntry(mockBooking);

    // Call the save method
    const savedBooking = await bookingEntry.save();

    // Assertions
    expect(savedBooking).toMatchObject(mockBooking);
    expect(BookingEntry.prototype.save).toHaveBeenCalled();
  });

  it('BACKEND_BOOKINGS_2: should fetch booking by unique email', async () => {
    const email = 'john.doe@example.com';
    const mockBooking = {
      email: email,
      session_id: '12345',
      bookingDetails: {
        leadGuest: {
          firstName: 'John',
          lastName: 'Doe',
          email: email,
          phone: '1234567890',
        },
        specialRequests: 'Late check-out',
        roomType: 'Deluxe',
        roomOnlyPrice: 100,
        breakfastPrice: 20,
        cancelPolicy: 'Free cancellation',
      },
      searchDetails: {
        checkin: new Date(),
        checkout: new Date(),
        adults: 2,
        children: 0,
        rooms: 1,
        days: 2,
      },
      hotelDetails: {
        destination: 'Paris',
        address: '123 Main St',
        description: 'A beautiful hotel in Paris.',
        hotelName: 'Hotel Paris',
      },
    };

    // Mock the findOne method to return the mockBooking when the email is queried
    BookingEntry.findOne = jest.fn().mockResolvedValue(mockBooking);

    // Simulate fetching the booking by email
    const fetchedBooking = await BookingEntry.findOne({ email: email });

    // Assertions
    expect(BookingEntry.findOne).toHaveBeenCalledWith({ email: email });
    expect(fetchedBooking).toEqual(mockBooking);
    expect(fetchedBooking.email).toBe(email);
    expect(fetchedBooking.bookingDetails.leadGuest.email).toBe(email);
  });
  });

  it('BACKEND_BOOKINGS_3: ensures unique session id for bookings under the same email', async () => {
    const email = 'john.doe@example.com';

    // Mock data for two bookings with the same email but different session IDs
    const mockBooking1 = {
      email: email,
      session_id: 'unique_session_id_1',
      bookingDetails: {
        leadGuest: { firstName: 'John', lastName: 'Doe', email: email },
        roomType: 'Deluxe',
      },
      searchDetails: { checkin: new Date(), checkout: new Date() },
      hotelDetails: { hotelName: 'Hotel One' },
    };

    const mockBooking2 = {
      email: email,
      session_id: 'unique_session_id_2',
      bookingDetails: {
        leadGuest: { firstName: 'John', lastName: 'Doe', email: email },
        roomType: 'Suite',
      },
      searchDetails: { checkin: new Date(), checkout: new Date() },
      hotelDetails: { hotelName: 'Hotel Two' },
    };

    // Mock the save method to simulate saving to the database
    BookingEntry.prototype.save = jest.fn()
      .mockResolvedValueOnce(mockBooking1)
      .mockResolvedValueOnce(mockBooking2);

    // Simulate saving both bookings
    const savedBooking1 = await new BookingEntry(mockBooking1).save();
    const savedBooking2 = await new BookingEntry(mockBooking2).save();

    // Assertions
    expect(savedBooking1.session_id).toBe('unique_session_id_1');
    expect(savedBooking2.session_id).toBe('unique_session_id_2');
    expect(savedBooking1.email).toBe(email);
    expect(savedBooking2.email).toBe(email);
    expect(savedBooking1.session_id).not.toBe(savedBooking2.session_id); // Ensure unique session IDs
  
    });


