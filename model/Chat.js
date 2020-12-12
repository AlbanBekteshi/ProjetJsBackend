"strict mode";
const FILE_PATH = __dirname + "./../data/chatData.json";
class Chat{
    constructor(idUser,username, text, date) {
        this.idUser = idUser;
        this.text = text;
        this.username = username;
        this.date = date;
    }
    static addDataJson(idUser, username, text, date){
        addData(idUser, username, text, date, FILE_PATH);
    }
    static getData(){
        return getData(FILE_PATH);
    }
}

/**
 * Ajout des messages dans la fichier json
 * @param idUser
 * @param username
 * @param text
 * @param filePath
 * @returns {*[]}
 */
function addData(idUser,username, text, date, filePath){
    const fs = require('fs');
    if (!fs.existsSync(filePath)) return [];

    let rawData = fs.readFileSync(filePath);

    let dataText;
    if (rawData) {
        dataText = JSON.parse(rawData);
    }
    dataText[dataText.length] = new Chat(idUser,username, text, date);
    let data = JSON.stringify(dataText);
    fs.writeFileSync(filePath, data);
}

/**
 * Récupération de l'historique du message.
 * @param filePath
 * @returns {*[]}
 */
function getData(filePath){
    const fs = require("fs");
    if (!fs.existsSync(filePath)) return [];
    let rawData = fs.readFileSync(filePath);
    let list;
    if (rawData) list = JSON.parse(rawData);
    else list = [];
    return list;
}
module.exports = Chat;