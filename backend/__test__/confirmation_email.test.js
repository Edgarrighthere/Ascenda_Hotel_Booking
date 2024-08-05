const request = require('supertest');
// const emailer = require("../controllers/emailer.js");
const app = require('../app.js');

jest.setTimeout(10000); 

describe("Backend confirmation email tests", () => {
    test ("BACKEND_CONFIRMATION_EMAIL_1: Testing sending a confirmation email", async () => {
        //Our test mail options
        const payload = {
            email: 'test@test.com', 
            firstName: 'John',
            hotelName: 'TheHotel',
            bookingDetails: {
                hotelId: "0T0T",
                roomType: "TESTROOM",
                roomOnlyPrice: 1234,
                cancelPolicy: "freeCancellation",
                destination: "Wonderland",
                destinationId: "I3EI",
                checkin: "2024-08-04",
                checkout: "2024-08-10",
                guests: 1
            } 
        };

        //Get mock response
        const res = await request(app)
        .post('/confirmation_email')
        .send(payload)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');
     
        const json = JSON.parse(res.text);

        expect(res.statusCode).toEqual(200);
        expect(json.success).toEqual(true);

    });

    test ("BACKEND_CONFIRMATION_EMAIL_2: Testing sending a confirmation email, but with missing field", async () => {
        //Our test mail options
        const payload = {
            email: 'test@test.com', 
            firstName: 'John',
            hotelName: 'TheHotel',
            bookingDetails: {
                hotelId: "0T0T",
                roomType: "TESTROOM",
                roomOnlyPrice: 1234,
                cancelPolicy: "freeCancellation",
                destination: "Wonderland",
                destinationId: "I3EI",
                checkin: "2024-08-04",
                checkout: "2024-08-10",
                // guests: 1 #Missing quest field
            } 
        };

        //Get mock response
        const res = await request(app)
        .post('/confirmation_email')
        .send(payload)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');
     
        const json = JSON.parse(res.text);

        expect(res.statusCode).toEqual(400);
        expect(json.message).toEqual('Missing fields in booking details');

    });

})