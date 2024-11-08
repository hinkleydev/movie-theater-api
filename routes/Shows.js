const { Router } = require("express");
const { User, Show } = require("../models/index.js");

const router = Router();

// --- CREATE operations ---

// --- READ operations ---

// List all shows
router.get("/", async function(req, res) {
    const shows = await Show.findAll();
    res.json(shows);
})

// Get a specific show
router.get("/:id", async function(req, res) {
    const show = await Show.findByPk(req.params.id);
    res.json(show);
})

// Get all the users that watched a show
router.get("/:id/users", async function(req, res) {
    const show = await Show.findByPk(req.params.id, { include: User })
    res.json(show.users);
})

// --- UPDATE operations ---

// Toggle availability for show
router.put("/:id/available", async function(req, res) {
    const show = await Show.findByPk(req.params.id);
    const available = show.getDataValue("available")
    show.update({ available: !available });
    res.json(show);
})

// -- DELETE operations ---

// Delete show
router.delete("/:id", async function(req, res) {
    const show = await Show.findByPk(req.params.id);
    await show.destroy();
    res.status(204).send();
})

module.exports = { shows: router }