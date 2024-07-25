const express = require("express");
var router = express.Router();
const destinationJSON = require("../destinations.json")

async function getDestinationId(destName) {
    var destinationId = null
    for (let dest of destinationJSON) {
        if (destName.includes(dest.term)) {
            destinationId = dest.uid
            break
        }
    }
    return destinationId
}

/* GET destination ID from name */
router.get("/:destination", async function (req, res, next) {
    const destName = req.params.destination
    const destinationId = await getDestinationId(destName)
    console.log(destinationId)

    if (destinationId != null) {
        res.set("Access-Control-Allow-Origin", "http://localhost:3000");
        res.send(`${destinationId}`);
    } else {
        return res.status(400).json({message: "Invalid Input: Destination name is invalid."})
    }
})

router.get("/", async function (req, res, next) {
    res.set("Access-Control-Allow-Origin", "http://localhost:3000");
    res.send(`${JSON.stringify(destinationJSON)}`)
})



module.exports = {
    getDestinationId: getDestinationId, 
    router: router
}