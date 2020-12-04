var express = require("express");
var router = express.Router();
var Items = require("../model/Items");

let {authorize, signAsynchronous} = require("../utils/auth");

/* GET user object from username */
router.get("/", function (req, res, next) {
    console.log("GET /items");
    const items = Items.getAllItemsCollection();
    return res.json(items);
});

/**
 * Get items collection from userId
 * Si fetch() GET /api/users/1 + authorization header contenant le token (token.userId)
 */
router.get("/:userId", authorize, function (req, res, next) {
    console.log("GET items/:userId", req.params.userId);
    const idUser = req.params.userId;
    const itemCollectionId = Items.getItemsCollectionIdListForUser(idUser);
    const itemCollectionListForThisUser = [];
    for(let index = 0; index < itemCollectionId.length; index++){
        itemCollectionListForThisUser.push(Items.getItemsById(itemCollectionId[index]));
    }
    if (itemCollectionListForThisUser) {
        return res.json(itemCollectionListForThisUser);
    } else {
        return res.status(404).send("ressource not found");
    }
});


module.exports = router;
