var express = require("express");
var router = express.Router();
var Game = require("../model/Game");

let {authorize, signAsynchronous} = require("../utils/auth");

router.get("/games", function (req, res, next){
    return res.json(Game.getAllGame());
});

module.exports = router;