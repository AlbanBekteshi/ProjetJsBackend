"strict mode";
const bcrypt = require("bcrypt");
const saltRounds = 10;
const myPlaintextPassword = "145OkyayNo668Pass";
//const FILE_PATH = __dirname + "/users.json";
const FILE_PATH = __dirname + "./../data/users.json";

class User {
  constructor(username, email, password, fName, lName, idUser, connected) {
    //TODO modifié et gérer l'utilisateur NOUVEAU et Existant
    this.idUser = idUser;
    //this.idUser = getUserListFromFile(FILE_PATH).length+1;
    this.username = username;
    this.email = email;
    this.password = password;
    this.fName = fName;
    this.lName = lName;
    this.avatar = null;
    this.type = "users";
    this.itemCollections = [];
    this.connected = connected;
  }


  /* return a promise with async / await */ 
  async save() {
    let userList = getUserListFromFile(FILE_PATH);
    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    userList.push({
      idUser: this.idUser,
      username: this.username,
      email: this.email,
      password: hashedPassword,
      fName: this.fName,
      lName: this.lName,
      avatar: this.avatar,
      type: this.type,
      itemCollections: this.itemCollections,
      connected: this.connected
    });
    saveUserListToFile(FILE_PATH, userList);
    return true;
  }

  /* return a promise with classic promise syntax*/
  checkCredentials(username, password) {
    if (!username || !password) return false;
    let userFound = User.getUserFromList(username);
    if (!userFound) return Promise.resolve(false);
    return bcrypt
      .compare(password, userFound.password)
      .then((match) => match)
      .catch((err) => err);
  }


  static updateConnection(value, userId){
    updateConnectedField(value, userId, FILE_PATH);
  }
  static getList() {
    return getUserListFromFile(FILE_PATH);
  }

  static isUsername(username) {
    const userFound = User.getUserFromList(username);
    return userFound !== undefined;
  }

  static isUserEmail(email){
    const userFound = User.getUserFromListMail(email);
    return userFound !== undefined;
  }

  static getUserFromListById(userID) {
    const userList = getUserListFromFile(FILE_PATH);
    for (let index = 0; index < userList.length; index++) {
      if (userList[index].idUser == userID) return userList[index];
    }
    return undefined;
  }

  static getUserFromList(username) {
    const userList = getUserListFromFile(FILE_PATH);
    for (let index = 0; index < userList.length; index++) {
      if (userList[index].username === username) return userList[index];
    }
    return undefined;
  }

  static getUserId(username){
    const userList = getUserListFromFile(FILE_PATH);
    for (let index = 0; index < userList.length; index++) {
      if (userList[index].username === username) return userList[index].idUser;
    }
    return -1;
  }

  static getUserFromListMail(email) {
    const userList = getUserListFromFile(FILE_PATH);
    for (let index = 0; index < userList.length; index++) {
      if (userList[index].email === email) return userList[index];
    }
    return;
  }

  static addItemIntoItemCollection(itemId,userId){
    return addItemToCollection(itemId,userId);
  }
}

function getUserListFromFile(filePath) {
  const fs = require("fs");
  if (!fs.existsSync(filePath)) return [];
  let userListRawData = fs.readFileSync(filePath);
  let userList;
  if (userListRawData) userList = JSON.parse(userListRawData);
  else userList = [];
  return userList;
}

function saveUserListToFile(filePath, userList) {
  const fs = require("fs");
  let data = JSON.stringify(userList);
  fs.writeFileSync(filePath, data);
}
function updateConnectedField(value, userId, filePath){
  //TODO refactor from getUserListFromFile() ?
  //let userList = getUserListFromFile(filePath);
  const fs = require("fs");
  if (!fs.existsSync(filePath)) return [];
  let userListRawData = fs.readFileSync(filePath);
  let userList;
  if (userListRawData) {
    userList = JSON.parse(userListRawData);
  }

  for(let i = 0; i < userList.length; i++){
    if(userList[i].idUser == userId ){
      userList[i].connected = value;
      break;
    }
  }
  let data = JSON.stringify(userList);
  fs.writeFileSync(filePath, data);
}

/**
 * Ajoute l'item (itemId) dans la collection du user (userId)
 * @param itemId id de l'item a ajouter
 * @param userId id du suer chez qui rajouter l'item
 */
function addItemToCollection(itemId,userId){
  const fs = require('fs');
  if(!fs.existsSync(FILE_PATH)) return false;

  let userListRawData = fs.readFileSync(FILE_PATH);
  let userList;
  if (userListRawData) {
    userList = JSON.parse(userListRawData);
  }
  else{return false;}

  for(let i = 0; i < userList.length; i++){
    if(userList[i].idUser == userId ){
      let list = userList[i].itemCollections;
      console.log("avant",list);
      list.push(parseInt(itemId));
      userList[i].itemCollections = list;
      console.log("apres",list);
    }
  }
  let data = JSON.stringify(userList);
  fs.writeFileSync(FILE_PATH, data);

  return true;
}

module.exports = User;
