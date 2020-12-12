"strict mode";
const FILE_PATH = __dirname + "./../data/chatData.json";
class Chat{
    constructor(idUser,username, text) {
        this.idUser = idUser;
        this.text = text;
        this.username = username;
    }
    static addDataJson(idUser, username, text){
        addData(idUser, username, text, FILE_PATH);
    }
    static getData(){
        return getData(FILE_PATH);
    }
}
function addData(idUser,username, text, filePath){
    const fs = require('fs');
    if (!fs.existsSync(filePath)) return [];

    let rawData = fs.readFileSync(filePath);

    let dataText;
    if (rawData) {
        dataText = JSON.parse(rawData);
    }
    dataText[dataText.length] = new Chat(idUser,username, text);
    let data = JSON.stringify(dataText);
    fs.writeFileSync(filePath, data);
}
function getData(filePath){
    const fs = require("fs");
    if (!fs.existsSync(filePath)) return [];
    let rawData = fs.readFileSync(filePath);
    let list;
    if (rawData) list = JSON.parse(rawData);
    else list = [];
    console.log(list);
    return list;
}
module.exports = Chat;