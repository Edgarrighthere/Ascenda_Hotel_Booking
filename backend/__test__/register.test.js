const db = require('../models/db.js');
const bcrypt = require("bcryptjs");
const model = require('../models/user.js');

const app = require('../app.js');
const request = require('supertest');

async function setup() {
    try {
        //Backup existing data to a temp collection
        // await model.UsersCollection.copyTo("tempusers")
        await model.UsersCollection.aggregate([{ $out : "tempusers" }]);

        //Clear the collection //Seems like aggregate already moves the collection
        // await model.UsersCollection.deleteMany({}); 

        //Create the test login user

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("testPassword", salt);

        const newUser = new model.UsersCollection({
            email: "test@test.com",
            password: hashedPassword,
            salutation: "Mr",
            firstName: "John",
            lastName: "Doe",
            countryCode: "TEST",
            phoneNumber: "12345678",
            accountBookings: []
        });

        //Insert it and save
        await newUser.save();
    
    } catch (error) {
        console.error("setup failed. " + error);
        throw error;
    }

}

async function teardown() {
    try {
        //Clear the user collection (i.e remove the test user)
        // await model.UsersCollection.deleteMany({});

        //Restore the collection from the backup
        const TempUsersCollection = db.mongoose.model("tempusers", model.userSchema);

        //This seems to override whatever that was in users, completely replaces users. So no need to clear 
        await TempUsersCollection.aggregate([{ $out : "users" }]);
        
        //Close the database connection
        await db.mongoose.disconnect();

    } catch (error) {
        console.error("teardown failed. " + error);
        throw error;
    }

}

describe("Backend register tests", () => {
    beforeAll(async () => {
        await setup();
    });

    afterAll(async () => {
        await teardown();
    });

    test ("BACKEND_REGISTER_1: Testing valid registration", async () => {
        //Our test user credentials
        const payload = {
            email: 'tes2t@test.com', // Email cannot be same
            password: 'testPassword',
            salutation: 'Mr',
            firstName: 'John', // Names can be same
            lastName: 'Doe',
            countryCode: '65',
            phoneNumber: '87654321'
        };

        //Get mock response
        const res = await request(app)
            .post('/register')
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        
        const json = JSON.parse(res.text);

        // console.log(json);
        // console.log(res);

        expect(res.statusCode).toEqual(201);
        expect(json.message).toBe("User successfully created. Redirecting to Login page now...");
    }, 20000);

    test ("BACKEND_REGISTER_2: Testing email already exist in database", async () => {
        //Our test user credentials
        const payload = {
            email: 'test@test.com', // Email cannot be same
            password: 'testPassword',
            salutation: 'Mr',
            firstName: 'John', // Names can be same
            lastName: 'Doe',
            countryCode: '65',
            phoneNumber: '87654321'
        };

        //Get mock response
        const res = await request(app)
            .post('/register')
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        
        const json = JSON.parse(res.text);

        // console.log(json);
        // console.log(res);

        expect(res.statusCode).toEqual(400);
        expect(json.message).toBe("User Email already exists. Please log in.");
    }, 20000);

    test ("BACKEND_REGISTER_3: Testing phone number already exist in database", async () => {
        //Our test user credentials
        const payload = {
            email: 'test3@test.com', // Email cannot be same
            password: 'testPassword',
            salutation: 'Mr',
            firstName: 'John', // Names can be same
            lastName: 'Doe',
            countryCode: '65',
            phoneNumber: '87654321'
        };

        //Get mock response
        const res = await request(app)
            .post('/register')
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        
        const json = JSON.parse(res.text);

        // console.log(json);
        // console.log(res);

        expect(res.statusCode).toEqual(400);
        expect(json.message).toBe("User Phone Number already exists. Please log in.");
    }, 20000);

    test ("BACKEND_REGISTER_4: Testing invalid phone number", async () => {
        //Our test user credentials
        const payload = {
            email: 'test3@test.com', // Email cannot be same
            password: 'testPassword',
            salutation: 'Mr',
            firstName: 'John', // Names can be same
            lastName: 'Doe',
            countryCode: '65',
            phoneNumber: 'PHONENUMBER' // Wrong
        };

        //Get mock response
        const res = await request(app)
            .post('/register')
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        
        const json = JSON.parse(res.text);

        // console.log(json);
        // console.log(res);

        expect(res.statusCode).toEqual(400);
        expect(json.message).toBe("Phone number must contain only digits.");
    }, 20000);

    test ("BACKEND_REGISTER_5: Testing invalid schema", async () => {
        //Our test user credentials
        const payload = {
            emailllll: 'test3@test.com', // Email cannot be same
            password: 'testPassword',
            salutation: 'Mr',
            firstName: 'John', // Names can be same
            lastName: 'Doe',
            countryCode: '65',
            phoneNumber: '12567834'
        };

        //Get mock response
        const res = await request(app)
            .post('/register')
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        
        const json = JSON.parse(res.text);

        // console.log(json);
        // console.log(res);

        expect(res.statusCode).toEqual(500);
        expect(json.message).toBe("An error occurred. Please try again.");
    }, 20000);
})