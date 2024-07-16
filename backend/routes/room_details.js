var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/:ID", async function(req, res, next){
    try{
        const id = req.params.ID;

        const url = `https://hotelapi.loyalty.dev/api/hotels/${id}`;
        console.log(url);
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
          // Parse the JSON data from the response
          const data = await response.json();
          res.set("Access-Control-Allow-Origin", "http://localhost:3000");
          res.json(data);
          
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
    }
});


module.exports = router;
