var express = require('express');
var router = express.Router();
const { RoomsAvailable } = require("../models/roomsAvailable.js");

async function getHotelDetails(id) {
  const hotel_url = `https://hotelapi.loyalty.dev/api/hotels/${id}`;
  const hotel_response = await fetch(hotel_url)
  const hotel_json = await hotel_response.json()
  return hotel_json
}

async function getRooms(id, destinationId, checkin, checkout, guests) {
  const price_url = `https://hotelapi.loyalty.dev/api/hotels/${id}/price?destination_id=${destinationId}&checkin=${checkin}&checkout=${checkout}&lang=en_US&currency=SGD&country_code=SG&guests=${guests}&partner_id=1`;
  var completed = false
  var rooms_response;
  var rooms_json;

  while (completed == false) {
    rooms_response = await fetch(price_url)
    rooms_json = await rooms_response.json()
    completed = rooms_json["completed"]
  }
  return rooms_json
}

async function mapHotelDetails(hotel_json) {
  var new_room = RoomsAvailable.fromJSON(hotel_json)
  return new_room
}

async function mapRoomDetails(rooms_json, new_room) {
  rooms_json.rooms.map(room_variations => {
    new_room.populateRoomList(room_variations)
  });
  return new_room
}

router.get("/:ID/:DESTINATIONID/:CHECKIN/:CHECKOUT/:GUESTS", async function(req, res, next) {
  const currentDate = new Date().toISOString().slice(0, 10)
  const id = req.params.ID;
    const destinationId = req.params.DESTINATIONID;
    const checkin = req.params.CHECKIN;
    const checkout = req.params.CHECKOUT;
    const guests = req.params.GUESTS;
    console.log(id, destinationId, checkin, checkout, guests)

    res.set("Access-Control-Allow-Origin", "http://localhost:3000");

    if (checkin < currentDate) {
        return res.status(400).json({message: "Invalid Input: Check-in date cannot be before current date."})
    } else if (checkin >= checkout) {
        return res.status(400).json({message: "Invalid Input: Check-out date must be at least one day after check-in date."})
    } else if (guests == 0 || guests == null) {
        return res.status(400).json({message: "Invalid Input: There must be at least 1 guest."})
    } else {
        // Fetch both data in parallel
        const [hotel_json, rooms_json] = await Promise.all([
          getHotelDetails(id),
          getRooms(id, destinationId, checkin, checkout, guests)
        ]);

        if (rooms_json["rooms"].length > 0) {
          var new_room = await mapHotelDetails(hotel_json)
          var room_details = await mapRoomDetails(rooms_json, new_room)
          res.send(room_details)
        } else {
          return res.status(400).json({message: "No rooms found."})
        }
    }    
});

module.exports = {
  getHotelDetails: getHotelDetails,
  getRooms: getRooms,
  mapHotelDetails: mapHotelDetails,
  mapRoomDetails: mapRoomDetails,
  router: router
};