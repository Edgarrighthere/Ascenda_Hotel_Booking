const db = require('../models/db.js');
const model = require('../models/user.js');
const emailer = require("../controllers/emailer.js");

const request = require('supertest')
const bcrypt = require("bcryptjs");

const app = require('../app.js');

async function setup() {
    try {
        //Backup existing data to a temp collection
        //await model.UsersCollection.copyTo("TempUsers")
        await model.UsersCollection.aggregate([{ $out : "TempUsers" }]);

        //Clear the collection
        await model.UsersCollection.deleteMany({});

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
            phoneNumber: "12345678"
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
        await model.UsersCollection.deleteMany({});

        //Restore the collection from the backup
        const TempUsersCollection = db.mongoose.model("TempUsers", model.userSchema);

        await TempUsersCollection.aggregate([{ $out : "Users" }]);
        
        //Close the database connection
        await db.mongoose.disconnect();

    } catch (error) {
        console.error("teardown failed. " + error);
        throw error;
    }

}

describe("Routes login endpoint unit tests", () => {
    beforeAll(async () => {
        await setup();
    });

    test ("BACKEND_LOGIN_1: Testing valid login", async () => {
        //Our test user credentials
        const payload = {
            email: 'test@test.com', 
            password: 'testPassword' 
        };

        //Get mock response
        const res = await request(app)
            .post('/login')
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        
        const json = JSON.parse(res.text);

        // console.log(json);

        expect(res.statusCode).toEqual(200);
        expect(json.message).toBe("Login successful. Verify with the OTP sent to your registered email...")
    });

    test ("BACKEND_LOGIN_2: Testing invalid email", async () => {
        //Our test user credentials
        const payload = {
            email: 'wrong@test.com', 
            password: 'testPassword' 
        };

        //Get mock response
        const res = await request(app)
            .post('/login')
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        
        const json = JSON.parse(res.text);

        // console.log(json);

        expect(res.statusCode).toEqual(400);
        expect(json.message).toBe("Invalid email.")
    });

    test ("BACKEND_LOGIN_3: Testing invalid password", async () => {
        //Our test user credentials
        const payload = {
            email: 'test@test.com', 
            password: 'wrongPassword' 
        };

        //Get mock response
        const res = await request(app)
            .post('/login')
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        
        const json = JSON.parse(res.text);

        // console.log(json);

        expect(res.statusCode).toEqual(400);
        expect(json.message).toBe("Invalid password.")
    });

    test ("BACKEND_LOGIN_4: Testing invalid email and password", async () => {
        //Our test user credentials
        const payload = {
            email: 'wrong@test.com', 
            password: 'wrongPassword' 
        };

        //Get mock response
        const res = await request(app)
            .post('/login')
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        
        const json = JSON.parse(res.text);

        // console.log(json);

        expect(res.statusCode).toEqual(400);
        expect(json.message).toBe("Invalid email.")
    });

    // test ("BACKEND_LOGIN_5: Testing invalid input", async () => {
    //     //Invalid input, should have been our test user credentials
    //     const payload = null;

    //     //Get mock response
    //     const res = await request(app)
    //         .post('/login')
    //         .send(payload)
    //         .set('Content-Type', 'application/json')
    //         .set('Accept', 'application/json');
        
    //     const json = JSON.parse(res.text);

    //     // console.log(json);

    //     expect(res.statusCode).toEqual(500);
    //     expect(json.message).toBe("An error occurred. Please try again.")
    // });
    
    afterAll(async () => {
        await teardown();
    });
})
