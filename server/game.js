const Game = require('./GameClass.js');

const currentGames = {};
const currentPlayers = {};

const createGame = () => {
    let newGame = new Game();
    currentGames[newGame.id] = newGame;
    return {
        player: newGame.players[0],
        game: newGame
    };
};


const joinGame = (gameId) => {
    let result = currentGames[gameId].addPlayer();
    return result;
};

const listPlayers = (gameId) => {
    return currentGames[gameId].players.map(({ player }) => player);
};

const cellClick = (gameId, playerId, row, col) => {
    let result = currentGames[gameId].cellClick(playerId, row, col);
    return result;
};

const removePlayer = (gameId, playerId) => {
    if(currentGames.hasOwnProperty(gameId)){
        let result = currentGames[gameId].removePlayer(playerId);
        return {
            error: null,
            player: playerId,
            game: result.game,
            turn: result.turn
        };
    } else {
        return null;
    }
};

const resetGame = (gameId) => {
    let result = currentGames[gameId].resetGame();
    return result;
};

module.exports = {
    createGame,
    joinGame,
    listPlayers,
    cellClick,
    removePlayer,
    resetGame
};