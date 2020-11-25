"strict mode";

const ITEMS_FILE_PATH = __dirname + "./../data/items.json";
const USERS_FILE_PATH = __dirname + "./../data/users.json";

class Items {

    constructor(userId) {
        this.userId = userId;
    }


    /**
     *
     * @param userId
     * @returns items Collection array for this user.
     */
    static getItemsCollectionIdListForUser(userId) {
        const userList = getUsersList(USERS_FILE_PATH);
        for (let userIndex = 0; userIndex < userList.length; userIndex++) {
            if (userList[userIndex].idUser = userId) {
                return userList[userIndex].itemCollections;
                break;
            }
            return undefined;
        }
    }

    static getItemsById(idItem) {
        const itemList = getItemById(ITEMS_FILE_PATH);
        for (let itemIndex = 0; itemIndex < itemList.length; itemIndex++) {
            if (itemList[itemIndex].itemId = idItem) {
                return itemList[itemIndex];
                break;
            }
            return undefined;
        }
    }
}

/**
 get usersList whose contains itemsCollection.
 */
function getUsersList(filePath) {
    const fs = require("fs");
    if (!fs.existsSync(filePath)) return [];
    let usersListRawData = fs.readFileSync(filePath);
    let usersList;
    if (usersListRawData) usersList = JSON.parse(usersListRawData);
    else usersList = [];
    return usersList;
}

function getItemById(filePath) {
    const fs = require("fs");
    if (!fs.existsSync(filePath)) return [];
    let itemListRawData = fs.readFileSync(filePath);
    let itemList;
    if (itemList) itemList = JSON.parse(itemListRawData);
    else itemList = [];
    return itemList;
}

module.exports = Items;