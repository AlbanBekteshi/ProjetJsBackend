"strict mode";

const GAME_FILE_PATH = __dirname + "./../data/games.json";

class Game {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    /**
     * Get game list
     */
    static getAllGame() {
        return getGame(GAME_FILE_PATH);
    }

}

function getGame(filePath) {
    const fs = require("fs");
    if (!fs.existsSync(filePath)) {
        return [];
    }
    let gamesListRawData = fs.readFileSync(filePath);
    let gameList;
    if (gamesListRawData) {
        gameList = JSON.parse(gamesListRawData);
    } else {
        gameList = [];
    }
    return gameList;
}
module.exports = Game;