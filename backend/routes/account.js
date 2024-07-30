const express = require('express');
const model = require('../models/user.js');

var router = express.Router();

// Endpoint to fetch user details
router.get('/details', async (req, res) => {
    const { firstName, lastName } = req.query;
    
    try {
      if (!firstName || !lastName) {
        console.error('First name and last name are required');
        return res.status(400).json({ message: 'First name and last name are required' });
      }
  
      console.log('Fetching user details for:', firstName, lastName);
  
      const user = await model.UsersCollection.findOne({ firstName, lastName });
      if (!user) {
        console.error('User not found:', firstName, lastName);
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({
        email: user.email,
        salutation: user.salutation, 
        firstName: user.firstName, 
        lastName: user.lastName,
        countryCode: user.countryCode,
        phoneNumber: user.phoneNumber
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
});
  
module.exports = router;