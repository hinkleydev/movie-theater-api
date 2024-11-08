const { Router } = require("express");
const { User, Show } = require("../models/index.js");
const { check, validationResult } = require("express-validator");
const router = Router();

// These functions will check the database to see if the user ID is valid
async function checkUserID(value) {
    const user = await User.findByPk(value);
    if (user == null) {
        // Not found
        throw "User not found";
    }
}

const isValidUserID = value => check("id").custom(checkUserID)


// --- CREATE operations ---

// --- READ operations ---

// Get all users - /users
router.get("/", async function(req, res) {
    const users = await User.findAll();
    res.json(users);
})

// Get a user - /users/:id
router.get("/:id", 
    isValidUserID(), 
    async function(req, res) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(404).json({ errors : errors.array() });
        return;
    }
    const user = await User.findByPk(req.params.id);
    res.json(user)
})

// Get shows a user has watched - /users/:id/shows
router.get("/:id/shows", 
    isValidUserID(),
    async function(req, res) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(404).json({ errors : errors.array() });
        return;
    }
    const user = await User.findByPk(req.params.id, {include: Show})
    res.json(user.shows); // It doesn't make sense to include the user again here IMO
})

// --- UPDATE operations ---

// Add a record of a watched show to a users account - /users/:id/shows/:show
router.put("/:id/shows/:show", 
    isValidUserID(), 
    async function(req, res) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(404).json({ errors : errors.array() });
        return;
    }
    let user = await User.findByPk(req.params.id);
    const show = await Show.findByPk(req.params.show);
    if (show == null) {
        res.status(404).json({ errors: "Show not found"});
        return;
    }
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