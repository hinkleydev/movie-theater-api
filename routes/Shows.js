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

// List all shows
router.get("/", async function(req, res) {
    const shows = await Show.findAll();
    res.json(shows);
})

// Get a specific show or search by genre
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

// Get all the users that watched a show
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

// Toggle availability for show
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

// --- DELETE operations ---

// Delete show
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