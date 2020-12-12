"strict mode";
const AVATAR_FILE_PATH = __dirname + "./../data/avatars.json";

class Avatar {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    /**
     * Récupération de tout les avatars
     * @returns {[]}
     */
    static getAllAvatar() {
        return getAvatar(AVATAR_FILE_PATH);
    }

    /**
     *
     * @param id
     * @returns name of avatar
     */
    static getAvatarNameById(idAvatar){
        const listAvatar = getAvatar();
        for(let i = 0; i < listAvatar.length; i++){
            if(idAvatar = listAvatar[i].id){
                return listAvatar[i].name;
            }
        }
        return;
    }
}

function getAvatar(filePath) {
    const fs = require("fs");
    if (!fs.existsSync(filePath)) return [];
    let avatarListRawData = fs.readFileSync(filePath);
    let avatarList;
    if (avatarListRawData) avatarList = JSON.parse(avatarListRawData);
    else avatarList = [];
    return avatarList;
}


module.exports = Avatar;