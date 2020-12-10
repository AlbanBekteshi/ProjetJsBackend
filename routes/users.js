var express = require("express");
var router = express.Router();
var User = require("../model/User");
var Items = require("../model/Items");
var Avatar = require("../model/Avatar");

let {authorize, signAsynchronous} = require("../utils/auth");
const jwt = require("jsonwebtoken");
const jwtSecret = "jkjJ1235Ohno!";
const LIFETIME_JWT = 24 * 60 * 60 * 1000; // 10;// in seconds // 24 * 60 * 60 * 1000 = 24h


/* POST user data for authentication */
router.post("/login", function (req, res, next) {
    let idUser = User.getUserId(req.body.username);
    if (idUser != -1) {
        let user = new User(req.body.username, req.body.password);
        user.checkCredentials(req.body.username, req.body.password).then((match) => {
            if (match) {
                User.updateConnection(true, idUser);
                jwt.sign({
                    idUser: idUser,
                    username: user.username
                }, jwtSecret, {expiresIn: LIFETIME_JWT}, (err, token) => {
                    if (err) {
                        return res.status(500).send(err.message);
                    }
                    return res.json({idUser: idUser, username: user.username, token});
                });
            } else {
                return res.status(401).send("bad username/password");
            }
        })
    }
});
router.post("/updateprofil", function (req, res, next) {
    let idUser = User.getUserId(req.body.username);
    if (idUser != -1) {
        User.updateProfil(req.body.userId, req.body.username, req.body.email, req.body.fName, req.body.lName, req.body.avatar);
    }
});

/* POST a new user */
router.post("/", function (req, res, next) {
    if (User.isUsername(req.body.username))
        return res.status(410).end();
    if (User.isUserEmail(req.body.email)) {
        return res.status(409).end();
    }

    const usersList = User.getList();

    let usersListLength = usersList.length;
    let userFound = false;
    let user;

    for (let index = 0; index < usersListLength; index++) {

        if (usersList[index].username == req.body.username) {
            user = new User(usersList[index].username, usersList[index].email, usersList[index].password, usersList[index].fName, usersList[index].lName, usersList[index].idUser,usersList[index].connected,userList[index].avatar);
            userFound = true;
            break;
        }
    }

    if (!userFound) {
        user = new User(req.body.username, req.body.email, req.body.password, req.body.fName, req.body.lName, usersList[usersListLength - 1].idUser + 1,true,req.body.avatar);
    }

    user.save().then(() => {
        jwt.sign({idUser: user.idUser, username: user.username}, jwtSecret, {expiresIn: LIFETIME_JWT}, (err, token) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            return res.json({idUser: user.idUser, username: user.username, token});
        });
    });
});
/* GET user list : secure the route with JWT authorization */
router.get("/", authorize, function (req, res, next) {
    return res.json(User.getList());
});

router.put("/logout/:userId", authorize, function (req, res, next) {
    User.updateConnection(false, req.params.userId);
});
router.put("/avatar/:userId", authorize, function (req, res, next) {
    User.updateAvatar(req.params.avatarId, req.params.userId);
});
router.get("/avatars", function (req, res, next) {
    let list = Avatar.getAllAvatar();
    res.send(list);
});
router.get("/avatar/:idAvatar", function (req, res, next) {
    return Avatar.getAvatarNameById(req.params.avatarID);
});
/**
 * Get items collection from userId
 * Si fetch() GET /api/users/1 + authorization header contenant le token (token.userId)
 */
router.get("/:idUser", authorize, function (req, res, next) {
    const idUser = req.params.idUser;
    const user = User.getUserFromListById(idUser);
    if (user != undefined)
        return res.json(user);
    else
        return res.status(404).send("ressource not found");
});

/**
 * Add item :idItem into ItemCollections from user
 */
router.put("/item/:idItem/:idUser", function (req, res, next) {
    //TODO possible modification pour récupérer le idUser
    const idUser = req.params.idUser;
    console.log("cest quoi "+idUser);
    console.log("idUser "+idUser);
    const idItem = req.params.idItem;
    if (User.addItemIntoItemCollection(idItem, idUser))
        return true;
    return res.status(400).send("An error happened");
});
/**
 * delete item :idItem into ItemCollections from user
 */
router.post("/item/:idItem/:idUser", function (req, res, next) {
    //TODO possible modification pour récupérer le idUser
    const idUser = req.params.idUser;
    console.log("cest quoi "+idUser);
    console.log("idUser "+idUser);
    const idItem = req.params.idItem;
    if (User.deleteItemIntoItemCollection(idItem,idUser))
        return true;
    return res.status(400).send("An error happened");
});


module.exports = router;
