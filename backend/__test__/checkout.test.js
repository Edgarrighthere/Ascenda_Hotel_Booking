const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const checkoutRouter = require('../routes/checkout');
const stripe = require('stripe');
const mongoose = require('mongoose');

// This test verifies that the POST /checkout endpoint correctly processes booking details, 
// creates a Stripe checkout session, and returns the expected response with session ID and state, 
// while properly managing the MongoDB connection.

// Mocking of the Stripe library
jest.mock('stripe', () => {
    return jest.fn(() => ({
        checkout: {
            sessions: {
                create: jest.fn().mockResolvedValue({
                    id: 'test_session_id'
                })
            }
        }
    }));
});

const app = express();
app.use(bodyParser.json());
app.use('/checkout', checkoutRouter);

beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/AscendaHotelBookingDB', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
});

afterAll(async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
});

describe('POST /checkout', () => {
    it('should create a Stripe checkout session and return session id and state', async () => {
        const requestBody = {
            hotelId: '123',
            roomType: 'Deluxe',
            roomOnlyPrice: 10000, 
            breakfastPrice: 2000, 
            cancelPolicy: 'Free cancellation until 24 hours before check-in',
            destinationId: 'dest_456',
            destination: 'Singapore',
            checkin: '2023-07-01',
            checkout: '2023-07-05',
            guests: 2
        };

        const response = await request(app)
            .post('/checkout')
            .send(requestBody);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', 'test_session_id');
        expect(response.body).toHaveProperty('state');
        expect(response.body.state).toEqual(requestBody);
    });
});
