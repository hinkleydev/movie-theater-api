const { Router } = require("express");
const { User, Show } = require("../models/index.js");
const router = Router();

// --- CREATE operations ---

// --- READ operations ---

// Get all users - /users
router.get("/", async function(req, res) {
    const users = await User.findAll();
    res.json(users);
})

// Get a user - /users/:id
router.get("/:id", async function(req, res) {
    const user = await User.findByPk(req.params.id);
    res.json(user)
})

// Get shows a user has watched - /users/:id/shows
router.get("/:id/shows", async function(req, res) {
    const user = await User.findByPk(req.params.id, {include: Show})
    res.json(user.shows); // It doesn't make sense to include the user again here IMO
})

// --- UPDATE operations ---

// --- DELETE operations

module.exports = { users: router }