var express = require("express");
var router = express.Router();
var Chat = require("../model/Chat");

let {authorize, signAsynchronous} = require("../utils/auth");

router.get("/", authorize, function (req, res, next){
    res.json(Chat.getData());
});

router.post("/:id/:username/:text/:date", authorize, function (req, res, next){
    return res.json(Chat.addDataJson(req.params.id, req.params.username,req.params.text, req.params.date));
});

module.exports = router;