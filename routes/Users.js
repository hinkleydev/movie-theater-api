const { Router } = require("express");

const router = Router();

router.get("/", function(req, res) {
    res.send("Users root");
})

module.exports = { users: router }