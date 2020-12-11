var express = require("express");
var router = express.Router();
var Chat = require("../model/Chat");

let {authorize, signAsynchronous} = require("../utils/auth");

router.get("/", authorize, function (req, res, next){
    res.json(Chat.getData());
});

router.post("/:id/:text", authorize, function (req, res, next){
    return res.json(Chat.addDataJson(req.params.id, req.params.text));
});

module.exports = router;