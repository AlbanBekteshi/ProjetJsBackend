var express = require("express");
var router = express.Router();
var User = require("../model/User.js");
var Items = require("../model/Items");

let {authorize, signAsynchronous} = require("../utils/auth");
const jwt = require("jsonwebtoken");
const jwtSecret = "jkjJ1235Ohno!";
const LIFETIME_JWT = 24 * 60 * 60 * 1000; // 10;// in seconds // 24 * 60 * 60 * 1000 = 24h

/* GET user list : secure the route with JWT authorization */
router.get("/", authorize, function (req, res, next) {
    return res.json(User.list);
});


/* POST user data for authentication */
router.post("/login", function (req, res, next) {
    let idUser = User.getUserId(req.body.username);
    if (idUser != -1) {
        let user = new User(req.body.username, req.body.password);
        user.checkCredentials(req.body.username, req.body.password).then((match) => {
            if (match) {
                jwt.sign({
                    idUser: idUser,
                    username: user.username
                }, jwtSecret, {expiresIn: LIFETIME_JWT}, (err, token) => {
                    if (err) {
                        return res.status(500).send(err.message);
                    }
                    console.log("POST users/ token:", token);
                    return res.json({idUser: idUser, username: user.username, token});
                });
            } else {
                return res.status(401).send("bad username/password");
            }
        })
    }
});

/* POST a new user */
router.post("/", function (req, res, next) {
    if (User.isUsername(req.body.username))
        return res.status(410).end();
    if (User.isUserEmail(req.body.email)) {
        return res.status(409).end();
    }

    const usersList = User.list;

    let usersListLength = usersList.length;
    let userFound = false;
    let user;

    for (let index = 0; index < usersListLength; index++) {

        if (usersList[index].username == req.body.username) {
            user = new User(usersList[index].username, usersList[index].email, usersList[index].password, usersList[index].fName, usersList[index].lName, usersList[index].idUser);
            userFound = true;
            break;
        }
    }

    console.log(userFound)
    if (!userFound) {
        user = new User(req.body.username, req.body.email, req.body.password, req.body.fName, req.body.lName, usersList[usersListLength - 1].idUser + 1);

    }


    user.save().then(() => {
        jwt.sign({idUser: user.idUser, username: user.username}, jwtSecret, {expiresIn: LIFETIME_JWT}, (err, token) => {
            if (err) {
                console.error("POST users/ :", err);
                return res.status(500).send(err.message);
            }
            console.log("POST users/ token:", token);

            return res.json({idUser: user.idUser, username: user.username, token});
        });
    });
});
/**
 * Get items collection from userId
 * Si fetch() GET /api/users/1 + authorization header contenant le token (token.userId)
 */
router.get("/:userId", authorize, function (req, res, next) {
    console.log("GET users/:userId", req.params.userId);
    const idUser = req.params.userId;
    const users = User.getUserFromListById(idUser);
    if (idUser > 0)
        return res.json(users);
    else
        return res.status(404).send("ressource not found");

});

/* GET user object from username */
router.get("/:username", function (req, res, next) {
    console.log("GET users/:username", req.params.username);
    const userFound = User.getUserFromList(req.params.username);
    if (userFound) {
        return res.json(userFound);
    } else {
        return res.status(404).send("ressource not found");
    }
});


module.exports = router;
