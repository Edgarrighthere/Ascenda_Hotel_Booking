
const request = require('supertest');
const app = require('../app.js');


describe("Backend room details tests", () => {

    test ("BACKEND_ROOM_DETAILS_1: Testing information retrieval", async () => {
        //Our test info
        const ID = "diH7";
        const DESTINATIONID = "WD0M";
        const CHECKIN = "2024-10-01";
        const CHECKOUT = "2024-10-07";
        const GUESTS = 2;

        //Get mock response
        const res = await request(app)
            .get(`/room_details/${ID}/${DESTINATIONID}/${CHECKIN}/${CHECKOUT}/${GUESTS}`)
            // .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        
        const json = JSON.parse(res.text);

        // console.log(res)

        console.log(json);

        expect(res.statusCode).toEqual(200);
    });

})