const express = require("express");
var router = express.Router();
const destinationJSON = require("../destinations.json");

/* GET destination ID from name */
router.get("/:destination", async function (req, res, next) {
    const destinationName = req.params.destination
    console.log(destinationName)
    var destinationId = null
    
    for (let getDestination of destinationJSON) {
        if (destinationName.includes(getDestination.term)) {
            destinationId = getDestination.uid
            console.log(destinationId)
            break
        }
    }

    if (destinationId != null) {
        res.set("Access-Control-Allow-Origin", "http://localhost:3000");
        res.send(`${destinationId}`);
    } else {
        return res.status(400).json({message: "Invalid Input: Destination name is invalid."})
    }
});

router.get("/", async function (req, res, next) {
    res.set("Access-Control-Allow-Origin", "http://localhost:3000");
    res.send(`${JSON.stringify(destinationJSON)}`)
})



module.exports = router;