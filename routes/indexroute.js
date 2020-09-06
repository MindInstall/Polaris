const express = require("express");
const router = express.Router();
const path = require('path');


router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../templetes/index.html'));
});
router.get("/style.css", (req, res) => {
    res.sendFile(path.join(__dirname, '../static/style.css'));
})
router.get("/logo.png", (req, res) => {
    res.sendFile(path.join(__dirname, "../static/logo.png"))
})
router.get("/examople.jpeg", (req, res) => {
    res.sendFile(path.join(__dirname, "../static/example.jpeg"))
})

module.exports = router;