var express = require("express");
var router = express.router();
var Game = require("../model/Game");

let {authorize, signAsynchronous} = require("../utils/auth");

router.get("/games", function (req, res, next){
    const games = Game.getAllGame();
    return res.json(games);
});