"strict mode";
const FILE_PATH = __dirname + "./../data/chatData.json";
class Chat{
    constructor(idUser, text) {
        this.idUser = idUser;
        this.text = text;
    }
    static addDataJson(idUser, text){
        addData(idUser, text, FILE_PATH);
    }
    static getData(){
        return getData(FILE_PATH);
    }
}
function addData(idUser,text, filePath){
    const fs = require('fs');
    if (!fs.existsSync(filePath)) return [];

    let rawData = fs.readFileSync(filePath);

    let dataText;
    if (rawData) {
        dataText = JSON.parse(rawData);
    }
    dataText[dataText.length] = new Chat(idUser, text);
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