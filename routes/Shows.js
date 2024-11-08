const { Router } = require("express");
const { User, Show } = require("../models/index.js");
const { Op } = require("../db/connection.js");
const { check, validationResult, ExpressValidator } = require("express-validator");

const router = Router();


// These functions will check the database to see if the show ID is valid
async function checkShowID(value) {
    const show = await Show.findByPk(value);
    if (show == null) {
        // Not found
        throw "Show not found";
    }
}

const isValidShowID = value => check("id").custom(checkShowID)

// --- CREATE operations ---

// --- READ operations ---

// List all shows - /shows
router.get("/", async function(req, res) {
    const shows = await Show.findAll();
    res.json(shows);
})

// Get a specific show or search by genre - /shows/:id
router.get("/:id", async function(req, res) {
    const show = await Show.findByPk(req.params.id);
    if(show != null) { // If the show matched an ID
        res.json(show);
        return;
    }
    const shows = await Show.findAll(
        { where: 
            { genre: 
                { [Op.like] : req.params.id } // Case insensitive comparison
            } 
        });
    return res.json(shows);
})

// Get all the users that watched a show - /shows/:id/users
router.get("/:id/users", 
    isValidShowID(),
    async function(req, res) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(404).json({ errors : errors.array() });
        return;
    }
    const show = await Show.findByPk(req.params.id, { include: User })
    res.json(show.users);
})

// --- UPDATE operations ---

// Toggle availability for show - /shows/:id/available
router.put("/:id/available", 
    isValidShowID(),
    async function(req, res) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(404).json({ errors : errors.array() });
        return;
    }
    const show = await Show.findByPk(req.params.id);
    const available = show.getDataValue("available");
    show.update({ available: !available });
    res.json(show);
})

// Set rating for show - /shows/:id/rating/:rating
router.put("/:id/rating/:rating",
    [isValidShowID(), check("rating").isFloat({ min: 1.0, max: 5.0 }).withMessage("Rating must be between 1 and 5")], // Validators
    async function(req, res) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(400).json({ errors : errors.array() });
        return;
    }
    const show = await Show.findByPk(req.params.id);
    await show.update({rating: req.params.rating});
    res.json(show);
    }
)

// --- DELETE operations ---

// Delete show - /shows/:id
router.delete("/:id",
    isValidShowID(),
    async function(req, res) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(404).json({ errors : errors.array() });
        return;
    }
    const show = await Show.findByPk(req.params.id);
    await show.destroy();
    res.status(204).send();
})

module.exports = { shows: router }