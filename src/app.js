const express = require("express");
const { users, shows } = require("../routes/index.js");
const app = express();

app.get("/", function(req, res) {
    res.send("Test!");
})

app.use("/users", users);
app.use("/shows", shows);

module.exports = { app }