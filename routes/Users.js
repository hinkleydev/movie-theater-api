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

// Add a record of a watched show to a users account - /users/:id/shows/:show
router.put("/:id/shows/:show", async function(req, res) {
    let user = await User.findByPk(req.params.id);
    const show = await Show.findByPk(req.params.show);
    await user.addShow(show);
    user = await User.findByPk(req.params.id, {include: Show});
    res.status(201).json(user.shows);
})
/* 
   I'm not sure if this should go under CREATE or UPDATE as it's creating a record
   of a watched show
*/

// --- DELETE operations ---

module.exports = { users: router }