const request = require('supertest');
const emailer = require("../controllers/emailer.js");


describe("Backend emailer tests", () => {
    test ("BACKEND_EMAILER_1: Testing sending an email", async () => {
        // Send email
        const mailOptions = {
            from: 'escc2g4@gmail.com',
            to: 'escc2g4@gmail.com',
            subject: "Test Email",
            text: `This is a test email.`
        };

        email_response = await emailer.transporter.sendMail(mailOptions);
        // console.log(email_response);

        expect(email_response.rejected).toEqual([]);
        expect(email_response.accepted).toEqual(["escc2g4@gmail.com"]);
    });

    // test ("BACKEND_EMAILER_2: Testing invalid receiver email address", async () => {
    //     // Send email
    //     const mailOptions = {
    //         from: 'escc2g4@gmail.com',
    //         to: 'escc2g4',
    //         subject: "Test Email",
    //         text: `This is a test email.`
    //     };
        
    //     expect(async () => {await emailer.transporter.sendMail(mailOptions)}).toThrow(Error);
    // });
    
})