const db = require('../models/db.js');
const model = require('../models/user.js');
const bcrypt = require("bcryptjs");

       
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

describe("Backend Users Collection tests", () => {
    beforeAll(async() => {
        await setup();
    });

    afterAll(async () => {
        await teardown();
    });

    test ("BACKEND_USERS_COLLECTION_1: Testing .findOne with valid email", async() => {
        const user = await model.UsersCollection.findOne({ email: "test@test.com" });
   
        // expect(user).toEqual(true); //To exist something
        expect(user.email).toEqual("test@test.com");
    });

    test ("BACKEND_USERS_COLLECTION_2: Testing .findOne with invalid email", async() => {
        const user = await model.UsersCollection.findOne({ email: "wrong@test.com" });
   
        expect(user).toEqual(null);
    });

    test ("BACKEND_USERS_COLLECTION_3: Testing .findOne with invalid key", async() => {
        const user = await model.UsersCollection.findOne({ test: "test@test.com" });
   
        expect(user).toEqual(null);
    });
    
})