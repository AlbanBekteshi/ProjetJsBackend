"strict mode";

//const ITEMS_FILE_PATH = __dirname + "./Data/items.json";
const USERS_FILE_PATH = __dirname + "./Data/users.json";

class Items {

    constructor(userId) {
        this.userId = userId;
    }

    /**
     * if user is current user then return his itemCollection
     * @param userId
     * @returns itemsCollection for current user
     */
    static isUserCollection(userId) {
        let itemsCollection = this.getItemsCollectionFromUsersList(userId);
        return itemsCollection;
    }

    /**
     *
     * @param userId
     * @returns items Collection array for this user.
     */
    static getItemsCollectionFromUsersList(userId) {
        const userList = getUsersList(USERS_FILE_PATH);
        for (let userIndex = 0; userIndex < userList.length; userIndex++) {
            if (userList[userIndex].idUser = userId) {
                return userList[userIndex].itemCollections;
                break;
            }
            return;
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