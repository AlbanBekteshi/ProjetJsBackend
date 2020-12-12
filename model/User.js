"strict mode";
const bcrypt = require("bcrypt");
const saltRounds = 10;
const myPlaintextPassword = "145OkyayNo668Pass";
//const FILE_PATH = __dirname + "/users.json";
const FILE_PATH = __dirname + "./../data/users.json";

class User {
  constructor(username, email, password, fName, lName, idUser, connected,avatar) {
    //TODO modifié et gérer l'utilisateur NOUVEAU et Existant
    this.idUser = idUser;
    //this.idUser = getUserListFromFile(FILE_PATH).length+1;
    this.username = username;
    this.email = email;
    this.password = password;
    this.fName = fName;
    this.lName = lName;
    this.avatar = avatar;
    this.type = "users";
    this.itemCollections = [];
    this.connected = connected;
  }

  /**
   *
   * @param idItem
   * @returns JSON USER LIST CONTAINS idItems
   */
  static getUserById(idItem){
    return getUserFromIdItem(idItem, FILE_PATH);
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

  /**
   * Appel à la fonction updateConnectedField pour faire le lien avec le route.
   * @param itemId
   * @returns {*[]}
   */
  static updateConnection(value, userId){
    updateConnectedField(value, userId, FILE_PATH);
  }
  /**
   * Appel à la fonction updateAvatar pour faire le lien avec le route.
   * @param itemId
   * @returns {*[]}
   */
  static updateAvatar(avatarId, userId){
    updateAvatar(userId, avatarId, FILE_PATH);
  }
  /*
  Récupération de la liste des utilisateurs
   */
  static getList() {
    return getUserListFromFile(FILE_PATH);
  }
  /**
   * Appel à la fonction updateProfil pour faire le lien avec le route.
   * @param itemId
   * @returns {*[]}
   */
  static updateProfil(userId, username, email, fName, lName, idAvatar){
    updateProfilById(userId, username, email, fName, lName, idAvatar, FILE_PATH );
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

  /**
   * Récupération du user en entier par son username
   * Code source : Cours JS
   * @param username
   * @returns {undefined|*}
   */
  static getUserFromList(username) {
    const userList = getUserListFromFile(FILE_PATH);
    for (let index = 0; index < userList.length; index++) {
      if (userList[index].username === username) return userList[index];
    }
    return undefined;
  }

  /**
   * Permet de récupérer l'id d'un user grâce à son username.
   * @param username
   * @returns {number|*}
   */
  static getUserId(username){
    const userList = getUserListFromFile(FILE_PATH);
    for (let index = 0; index < userList.length; index++) {
      if (userList[index].username === username) return userList[index].idUser;
    }
    return -1;
  }
  /**
   * Code source : Cours de JS
   * @param itemId
   * @returns {*[]}
   */
  static getUserFromListMail(email) {
    const userList = getUserListFromFile(FILE_PATH);
    for (let index = 0; index < userList.length; index++) {
      if (userList[index].email === email) return userList[index];
    }
    return;
  }
  /**
   * Appel à la fonction addItemIntoIte pour faire le lien avec le route.
   * @param itemId
   * @returns {*[]}
   */
  static addItemIntoItemCollection(itemId,userId){
    return addItemToCollection(itemId,userId);
  }
  /**
   * Appel à la fonction deleteItemToCollection pour faire le lien avec le route.
   * @param itemId
   * @returns {*[]}
   */
  static deleteItemIntoItemCollection(itemId,userId){
    return deleteItemToCollection(itemId,userId);
  }

  /**
   * Appel à la fonction getUserFromIdItem pour faire le lien avec le route.
   * @param itemId
   * @returns {*[]}
   */
  static  getUserFromIdItemItem(itemId){
    return getUserFromIdItem(itemId);
  }

}

/**
 * Update le profil de l'utilisateur
 * @param id
 * @param username
 * @param email
 * @param fName
 * @param lName
 * @param idAvatar
 * @param filePath
 * @returns {*[]}
 */
function updateProfilById(id, username, email, fName, lName, idAvatar, filePath ){
  const fs = require("fs");
  if (!fs.existsSync(filePath)) return [];
  let userListRawData = fs.readFileSync(filePath);
  let userList;
  if (userListRawData) {
    userList = JSON.parse(userListRawData);
  }

  for(let i = 0; i < userList.length; i++){
    if(userList[i].idUser == id ){
      userList[i].username = username;
      userList[i].email = email;
      userList[i].fName = fName;
      userList[i].lName =lName;
      userList[i].avatar = idAvatar;
      break;
    }
  }
  let data = JSON.stringify(userList);
  fs.writeFileSync(filePath, data);

}

/**
 * Source : Cours JS
 * @param filePath
 * @returns {*[]}
 */
function getUserListFromFile(filePath) {
  const fs = require("fs");
  if (!fs.existsSync(filePath)) return [];
  let userListRawData = fs.readFileSync(filePath);
  let userList;
  if (userListRawData) userList = JSON.parse(userListRawData);
  else userList = [];
  return userList;
}

/**
 * Source : Cours JS
 * @param filePath
 * @param userList
 */
function saveUserListToFile(filePath, userList) {
  const fs = require("fs");
  let data = JSON.stringify(userList);
  fs.writeFileSync(filePath, data);
}

/**
 * Mise à jour du champs connected pour gérer le statut de connection de l'utilisateur.
 * @param value
 * @param userId
 * @param filePath
 * @returns {*[]}
 */
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
  let userList = User.getList();
  if(!userList) return false;

  for(let i = 0; i < userList.length; i++){
    if(userList[i].idUser == userId ){
      let list = userList[i].itemCollections;
      list.push(parseInt(itemId));
      userList[i].itemCollections = list;
      break;
    }
  }
  let data = JSON.stringify(userList);
  fs.writeFileSync(FILE_PATH, data);

  return true;
}

/**
 * Supprime l'item de la collection de l'utilisateur
 * @param itemId
 * @param userId
 * @returns {boolean}
 */
function deleteItemToCollection(itemId,userId){
  const fs = require('fs');
  let userList = User.getList();
  if(!userList) return false;

  for(let i = 0; i < userList.length; i++){
    if(userList[i].idUser == userId ){
      let list = userList[i].itemCollections;
      let newlist= [];
      for (let index = 0; index < list.length; index++){
        if(list[index]!= itemId){
          newlist.push(list[index])
        }
      }
      userList[i].itemCollections = newlist;
    }
  }
  let data = JSON.stringify(userList);
  fs.writeFileSync(FILE_PATH, data);
  return true;
}

/**
 * Change l'avatar du personnage
 * @param userId
 * @param idAvatar
 * @param filePath
 * @returns {*[]}
 */
function updateAvatar(userId, idAvatar, filePath){
  const fs = require('fs');
  if (!fs.existsSync(filePath)) return [];
  let userListRawData = fs.readFileSync(filePath);
  let userList;
  if (userListRawData) {
    userList = JSON.parse(userListRawData);
  }

  for(let i = 0; i < userList.length; i++){
    if(userList[i].idUser == userId ){
      userList[i].avatar = idAvatar;
      break;
    }
  }
  let data = JSON.stringify(userList);
  fs.writeFileSync(filePath, data);
}

/**
 * Récupère les utilisateurs possédant l'item dans sa collection.
 * @param idItem
 * @returns {[]}
 */
function getUserFromIdItem(idItem){
  let userList = getUserListFromFile(FILE_PATH);
  let list=[];
  userList.forEach((user)=>{
    for(let index=0;index<user.itemCollections.length;index++){
      if(user.itemCollections[index]==idItem) list.push(user);
    }
  });
  return list;
}
module.exports = User;
