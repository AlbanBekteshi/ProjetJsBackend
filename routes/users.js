var express = require("express");
var router = express.Router();
var User = require("../model/User.js");
var Items = require("../model/Items");

let { authorize, signAsynchronous } = require("../utils/auth");
const jwt = require("jsonwebtoken");
const jwtSecret = "jkjJ1235Ohno!";
const LIFETIME_JWT = 24 * 60 * 60 * 1000 ; // 10;// in seconds // 24 * 60 * 60 * 1000 = 24h 

/* GET user list : secure the route with JWT authorization */
router.get("/", authorize, function (req, res, next) {
    return res.json(User.list);
});


/* POST user data for authentication */
router.post("/login", function (req, res, next) {
  let user = new User(req.body.email, req.body.email, req.body.password);
  console.log("POST users/login:", User.list);
  user.checkCredentials(req.body.email, req.body.password).then((match) => {
    if (match) {
      jwt.sign({ idUser:newUser.idUser, username: user.username }, jwtSecret,{ expiresIn: LIFETIME_JWT }, (err, token) => {
        if (err) {
          console.error("POST users/ :", err);
          return res.status(500).send(err.message);
        }
        console.log("POST users/ token:", token);
        return res.json({ username: user.username, token });
      });
    } else {
      console.log("POST users/login Error:", "Unauthentified");
      return res.status(401).send("bad email/password");
    }
  })  
});

/* POST a new user */
router.post("/", function (req, res, next) {
  console.log("POST users/", User.list);
  console.log("email:", req.body.email);
  if (User.isUsername(req.body.username))
    return res.status(410).end();
  if (User.isUserEmail(req.body.email))
    return res.status(409).end();
  let newUser = new User(req.body.username, req.body.email, req.body.password, req.body.fName, req.body.lName);
  console.log("newUser.idUser "+newUser.idUser);
  newUser.save().then(() => {
    console.log("afterRegisterOp:", User.list);
    jwt.sign({ idUser:newUser.idUser, username: newUser.username}, jwtSecret,{ expiresIn: LIFETIME_JWT }, (err, token) => {
      console.log("token: "+token);
      if (err) {
        console.error("POST users/ :", err);
        return res.status(500).send(err.message);
      }
      console.log("POST users/ token:", token);
      return res.json({ username: newUser.username, token });
    });
  });
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

/**
 * Get items collection from userId
 * Si fetch() GET /api/users/1 + authorization header contenant le token (token.userId)
 */
router.get("/:userId", authorize, function (req, res, next) {
  console.log("GET users/:userId", req.params.userId);
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
