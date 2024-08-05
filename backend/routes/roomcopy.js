var express = require('express');
var router = express.Router();
const { RoomsAvailable } = require("../models/roomsAvailable.js");

async function getHotelDetails(hotel_url) {

}

async function getRooms(price_url) {
  var completed = false
  var room_response;
  var room_json;

  while (completed == false) {
    room_response = await fetch(price_url)
    room_json = await room_response.json();
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/:ID/:DESTINATIONID/:CHECKIN/:CHECKOUT/:GUESTS", async function(req, res, next) {
  const currentDate = new Date().toISOString().slice(0, 10)
  try {
    const id = req.params.ID;
    const destinationId = req.params.DESTINATIONID;
    const checkin = req.params.CHECKIN;
    const checkout = req.params.CHECKOUT;
    const guests = req.params.GUESTS;

    const url1 = `https://hotelapi.loyalty.dev/api/hotels/${id}`;
    const url2 = `https://hotelapi.loyalty.dev/api/hotels/${id}/price?destination_id=${destinationId}&checkin=${checkin}&checkout=${checkout}&lang=en_US&currency=SGD&country_code=SG&guests=${guests}&partner_id=1`;

    res.set("Access-Control-Allow-Origin", "http://localhost:3000");

    if (checkin < currentDate) {
        return res.status(400).json({message: "Invalid Input: Check-in date cannot be before current date."})
    } else if (checkin >= checkout) {
        return res.status(400).json({message: "Invalid Input: Check-out date must be at least one day after check-in date."})
    } else if (guests == 0 || guests == null) {
        return res.status(400).json({message: "Invalid Input: There must be at least 1 guest."})
    } else {
        // Fetch both data in parallel
        const [hotelResponse, roomsResponse] = await Promise.all([
          fetch(url1),
          fetch(url2)
        ]);

        if (!hotelResponse.ok || !roomsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const hotelData = await hotelResponse.json();
        const new_room = RoomsAvailable.fromJSON(hotelData);

        let roomsJson = await roomsResponse.json();
        while (!roomsJson.completed) {
          const roomsResponseUpdated = await fetch(url2);
          roomsJson = await roomsResponseUpdated.json();
        }

        roomsJson.rooms.map(room_variations => {
          new_room.populateRoomList(room_variations);
        });

      res.set("Access-Control-Allow-Origin", "http://localhost:3000");
      res.json(new_room);
    }

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

module.exports = router;