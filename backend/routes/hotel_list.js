const express = require("express");
var router = express.Router();

/* GET hotel listing. */
router.get("/:msg", async function (req, res, next) {
    const hotelId = req.params.msg;
    console.log(hotelId);
    const api_url = "https://hotelapi.loyalty.dev/api/hotels/" + hotelId;
    console.log(api_url);

    const response = await fetch(api_url)
    const text = await response.text();
    const json = JSON.parse(text);

    res.set("Access-Control-Allow-Origin", "http://localhost:3000");
    //res.send(`${json}`);
    res.send(`${JSON.stringify(json)}`);
});

module.exports = router;