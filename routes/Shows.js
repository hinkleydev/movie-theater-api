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

// --- UPDATE operations ---

// -- DELETE operations ---

module.exports = { shows: router }