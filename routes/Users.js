const { Router } = require("express");
const { User } = require("../models/index.js");
const router = Router();

// --- CREATE operations ---

// --- READ operations ---

// Get all users - /users
router.get("/", async function(req, res) {
    const users = await User.findAll();
    res.json(users);
})

// --- UPDATE operations ---

// --- DELETE operations

module.exports = { users: router }