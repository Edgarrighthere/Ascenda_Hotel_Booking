const db = require('../models/db.js');
const model = require('../models/user.js');
const request = require('supertest');
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
            phoneNumber: "12345678",
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


describe("Backend verify otp unit tests", () => {
    beforeAll(async () => {
        await setup();
    });

    afterAll(async () => {
        await teardown();
    });

    beforeEach(async () => {
        const user = await model.UsersCollection.findOne({ email: "test@test.com" });
        
        user.otp = "123456";
        user.otpExpiration = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
        await user.save();
    });

    test ("BACKEND_VERIFY_OTP_1: Testing valid otp, before expired", async () => {
        
        const payload = {
            email: 'test@test.com', 
            otp: '123456' 
        };
       
        //Get mock response
        const res = await request(app)
            .post('/verify_otp')
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        
        const json = JSON.parse(res.text);

        expect(res.statusCode).toEqual(200);
        expect(json.message).toBe("OTP verified successfully.");
    });

    test ("BACKEND_VERIFY_OTP_2: Testing valid otp, after expired", async () => {
        //Special for this test case
        const user = await model.UsersCollection.findOne({ email: "test@test.com" });

        user.otpExpiration = Date.now() - 60 * 1000; // OTP set to be last valid 1 minute ago
        await user.save();

        const payload = {
            email: 'test@test.com', 
            otp: '123456' 
        };
       
        //Get mock response
        const res = await request(app)
            .post('/verify_otp')
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        
        const json = JSON.parse(res.text);

        expect(res.statusCode).toEqual(400);
        expect(json.message).toBe("Invalid OTP or OTP expired.");
    });

    test ("BACKEND_VERIFY_OTP_3: Testing invalid otp", async () => {
        const payload = {
            email: 'test@test.com', 
            otp: '111111' 
        };
       
        //Get mock response
        const res = await request(app)
            .post('/verify_otp')
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        
        const json = JSON.parse(res.text);

        expect(res.statusCode).toEqual(400);
        expect(json.message).toBe("Invalid OTP or OTP expired.");
    });

    test ("BACKEND_VERIFY_OTP_3: Testing empty inputs", async () => {
        const payload = {
            email: '', 
            otp: '' 
        };
       
        //Get mock response
        const res = await request(app)
            .post('/verify_otp')
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        
        const json = JSON.parse(res.text);

        expect(res.statusCode).toEqual(400);
        expect(json.message).toBe("Invalid OTP or OTP expired.");
    });

})