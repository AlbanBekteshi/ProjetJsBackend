"strict mode";

const ITEMS_FILE_PATH = __dirname + "./../data/items.json";
const USERS_FILE_PATH = __dirname + "./../data/users.json";

//const IMAGE_FOLDER = "Frontend/images";
class Items {

    constructor(userId, username, email, password, fName, lName, avatar, type, itemCollections) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.fName = fName;
        this.lName = lName;
        this.avatar = avatar;
        this.type = type;
        this.itemCollections = itemCollections;
        this.userId = userId;
    }

    /**
     * Bind items of itemsCollectionList for User
     * @param userId
     * @param items
     */
    static addItemsForUser(userId, items){
        addAllItems(USERS_FILE_PATH, userId, items);
    }
    /**
     * this function is used if the user not authentificated.
     * @returns allItems photo{[]}
     */
    static getAllItemsPhotoCollection() {
        const itemList = getAllItemsList(ITEMS_FILE_PATH);
        let imageList = [];
        for (let itemIndex = 0; itemIndex < itemList.length; itemIndex++) {
            imageList.push(itemList[itemIndex].image);
        }
        return imageList;
    }
    /**
     * this function is used if the user not authentificated.
     * @returns allItems {[]}
     */
    static getAllItemsCollection() {
        const itemList = getAllItemsList(ITEMS_FILE_PATH);
        let imageList = [];
        for (let itemIndex = 0; itemIndex < itemList.length; itemIndex++) {
            imageList.push(itemList[itemIndex]);
        }
        return imageList;
    }

    /**
     * @param userId
     * @returns items Collection array for this user.
     */
    static getItemsCollectionIdListForUser(userId) {
        const userList = getUsersList(USERS_FILE_PATH);
        const returnArray = [];
        userList.forEach(user => {
            if(user.idUser == userId) returnArray.push(user.itemCollections);
        });
       return returnArray;
    }

    /**
     * Récupération d'un item par son id
     * @param idItem
     * @returns {undefined|*}
     */
    static getItemsById(idItem) {
        const itemList = getAllItemsList(ITEMS_FILE_PATH);
        for (let itemIndex = 0; itemIndex < itemList.length; itemIndex++) {
            if (itemList[itemIndex].itemId == idItem) {
                return itemList[itemIndex];
                break;
            }
        }
        return undefined;
    }
}

function getUsersList(filePath) {
    const fs = require("fs");
    if (!fs.existsSync(filePath)) return [];
    let usersListRawData = fs.readFileSync(filePath);
    let usersList;
    if (usersListRawData) usersList = JSON.parse(usersListRawData);
    else usersList = [];
    return usersList;
}

/**
 * Récupération de la liste des items
 * @param filePath
 * @returns {*[]}
 */
function getAllItemsList(filePath) {
    const fs = require("fs");
    if (!fs.existsSync(filePath)) return [];
    let itemListRawData = fs.readFileSync(filePath);
    let itemList;
    if (itemListRawData) itemList = JSON.parse(itemListRawData);
    else itemList = [];
    return itemList;
}

/**
 * Ajout de tout les items pour un utilisateur
 * @param filePath
 * @param userId
 * @param items
 * @returns {*[]}
 */
function addAllItems(filePath, userId, items) {
    const fs = require("fs");
    if (!fs.existsSync(filePath)) return [];
    let userListRawData = fs.readFileSync(filePath);
    let userList;
    if (userList) userList = JSON.parse(userListRawData);
    for(let a = 0; a < userList.length ; a++){
        if (userList[a].idUser == userId) {
            for (let i = 0; i < items.length; i++) {
                userList[a].itemsCollections.push(items[i]);
            }
            break;
        }
    }
    let data = JSON.stringify(userList);
    fs.writeFileSync(filePath, data);

}

/*
function saveImageCollectionForUser(filePath, listItems) {
    const fs = require("fs");
    let data = JSON.stringify(items);
    fs.writeFileSync(filePath, data);
}*/

module.exports = Items;