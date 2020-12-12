"strict mode";

const GAME_FILE_PATH = __dirname + "./../data/games.json";

class Game {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    /**
     * Appel à la fonction getGame pour récupérer la liste et pour faire le lien avec la route
     */
    static getAllGame() {
        return getGame(GAME_FILE_PATH);
    }

}

/**
 * Récupération des games
 * @param filePath
 * @returns {*[]}
 */
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