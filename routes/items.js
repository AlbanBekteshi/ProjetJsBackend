var express = require("express");
var router = express.Router();
var Items = require("../model/Items");

let {authorize, signAsynchronous} = require("../utils/auth");

/* GET user object from username */
router.get("/", function (req, res, next) {
    return res.json(Items.getAllItemsCollection());
});

/**
 * Get items collection from userId
 * Si fetch() GET /api/users/1 + authorization header contenant le token (token.userId)
 */
router.get("/user/:userId", authorize, function (req, res, next) {
    const idUser = req.params.userId;
    const itemCollectionId = Items.getItemsCollectionIdListForUser(idUser);
    const itemCollectionListForThisUser = [];

    for(let index = 0; index < itemCollectionId[0].length; index++){
        itemCollectionListForThisUser.push(Items.getItemsById(itemCollectionId[0][index]));
    }
    if (itemCollectionListForThisUser) {
        return res.json(itemCollectionListForThisUser);
    } else {
        return res.status(404).send("ressource not found");
    }
});

/**
 * Get item from itemId
 */
router.get("/:itemId", function (req,res,next){
    return res.json(Items.getItemsById(req.params.itemId));
});

module.exports = router;
