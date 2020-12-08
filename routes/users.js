var express = require("express");
var router = express.Router();
var User = require("../model/User");
var Items = require("../model/Items");

let {authorize, signAsynchronous} = require("../utils/auth");
const jwt = require("jsonwebtoken");
const jwtSecret = "jkjJ1235Ohno!";
const LIFETIME_JWT = 24 * 60 * 60 * 1000; // 10;// in seconds // 24 * 60 * 60 * 1000 = 24h

/* GET user list : secure the route with JWT authorization */
router.get("/", authorize, function (req, res, next) {
    return res.json(User.getList());
});

router.put("/logout/:userId", authorize, function (req, res, next) {
    User.updateConnection(false, req.params.userId);
});

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
            user = new User(usersList[index].username, usersList[index].email, usersList[index].password, usersList[index].fName, usersList[index].lName, usersList[index].idUser);
            userFound = true;
            break;
        }
    }

    if (!userFound) {
        user = new User(req.body.username, req.body.email, req.body.password, req.body.fName, req.body.lName, usersList[usersListLength - 1].idUser + 1);
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

module.exports = router;
