const { Router } = require("express");
const { Show } = require("../models/index.js");

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

// --- UPDATE operations ---

// -- DELETE operations ---

module.exports = { shows: router }