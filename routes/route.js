const express = require("express");
const trimVideo = require("../controllers/trimVideo");

const route = express.Router();

route.post('/trimVideo',trimVideo);

module.exports = route;