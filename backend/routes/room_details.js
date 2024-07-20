var express = require('express');
var router = express.Router();
const {RoomsAvailable} = require("../models/roomsAvailable.js")


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/:ID/:DESTINATIONID/:CHECKIN/:CHECKOUT/:GUESTS", async function(req, res, next){
 
    try{
        const id = req.params.ID;
        const destinationId = req.params.DESTINATIONID;
        const checkin = req.params.CHECKIN;
        const checkout = req.params.CHECKOUT;
        const guests = req.params.GUESTS
        const url = `https://hotelapi.loyalty.dev/api/hotels/${id}`;
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          // Parse the JSON data from the response
          const data = await response.json();
          const new_room = RoomsAvailable.fromJSON(data);
          var completed = false;
          var rooms_response;
          var rooms_text;s
          var rooms_json;
          const url2 = `https://hotelapi.loyalty.dev/api/hotels/${id}/price?destination_id=${destinationId}&checkin=${checkin}&checkout=${checkout}&lang=en_US&currency=SGD&country_code=SG&guests=${guests}&partner_id=1`;

          while (completed== false){
            rooms_response = await fetch(url2)
            rooms_text = await rooms_response.text();
            rooms_json = JSON.parse(rooms_text)
            completed = rooms_json["completed"]
          }

          rooms_json["rooms"].map(room_variations => {
            new_room.populateRoomList(room_variations);
          })


          res.set("Access-Control-Allow-Origin", "http://localhost:3000");
          res.json(new_room);





        

          
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
    }
});


module.exports = router;
