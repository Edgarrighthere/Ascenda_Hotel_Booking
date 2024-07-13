const express = require("express");
var router = express.Router();
const destinationJSON = require("../destinations.json");

/* GET destination ID from name */
router.get("/:destination", async function (req, res, next) {
    const destinationName = req.params.destination
    console.log(destinationName)
    var destinationId
    
    for (let getDestination of destinationJSON) {
        if (destinationName.includes(getDestination.term)) {
            destinationId = getDestination.uid
            console.log(destinationId)
            break
        }
    }

    res.set("Access-Control-Allow-Origin", "http://localhost:3000");
    res.send(`${destinationId}`);
});

router.get("/", async function (req, res, next) {
    res.set("Access-Control-Allow-Origin", "http://localhost:3000");
    res.send(`${JSON.stringify(destinationJSON)}`)
})



module.exports = router;