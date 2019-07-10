const Player = require('./PlayerClass.js');

module.exports = class Game{
    constructor(){
        this.id = this.createUniqueId();
        this.colours = [
            'blue', 'red', 'green', 'orange', 'yellow', 'purple', 'teal', 'peach'
        ];
        this.players = [new Player(this.colours[0])];
        this.gameState = [
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null]
        ];
        this.messages = [
            {
                id: this.createUniqueId(), 
                name: this.players[0].name, 
                colour: this.colours[0], 
                message: `Send this link to your friends to join: http://localhost:3000/${this.id}`, 
                time: this.getTime()
            }
        ];
        this.playersTurn = 0;
        
    }

    createUniqueId(){
        return Math.random().toString(36).substr(2, 9);
    }

    addPlayer(){
        let existingPlayers = this.players.map(({ player }) => player);
        let colour = this.colours[this.players.length];
        let newPlayer = new Player(colour);
        this.players.push(newPlayer);
        this.messages.push({id: this.createUniqueId(), name: newPlayer.name, colour: newPlayer.colour, message: `Joined the game`, time: this.getTime()});
        return {
            player: newPlayer,
            game: this,
            turn: this.players[this.playersTurn].id
        };
    }

    removePlayer(p){
        let playerIdx = this.players.map(({ player }) => player).indexOf(p);
        if (playerIdx === this.playersTurn){
            this.playersTurn++;
            if (this.playersTurn > (this.players.length-1)) this.playersTurn = 0;
        }
        let pTurn = this.players[this.playersTurn].player;
        this.players = this.players.filter(({player, colour}) => player !== p);

        return {
            game: this,
            turn: pTurn
        };
    }
    
    resetGame(){
        this.gameState = [
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null]
        ];

        return {game: this, turn: this.players[this.playersTurn].id};
    }

    cellClick(player, row, col){
        let progressTurn = false;
        //need to see which one was clicked on and gravitate down to find the bottom available cell and use that.
        if (this.gameState[0][col] === null){
            this.gravitate(player, col);
            progressTurn = true;
        }
        if (progressTurn) this.playersTurn++;
        if (this.playersTurn > (this.players.length-1)) this.playersTurn = 0;
        return {
            player: player,
            game: this,
            turn: this.players[this.playersTurn].id,
            winner: this.checkWinner()
        };
    }

    gravitate(player, col){
        //player clicked on col.
        //start from the bottom and work up to find the first null row in this col
        for(let i = this.gameState.length-1; i >= 0; i--){
            if (this.gameState[i][col] === null){
                this.gameState[i][col] = this.players.find(el => el.id === player);
                break;
            }
        }
    }

    checkWinner(){
        //Directions
        //1 left to right               [0][1]
        //2 right to left               [0][-1]
        //3 top to bottom               [1][0]
        //4 bottom to top               [-1][0]
        //5 top left to bottom right    [1][1]
        //6 bottom right to top left    [-1][-1]
        //7 top right to bottom left    [1][-1]
        //8 bottom left to top right    [-1][1]
        let directions = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,-1],[1,-1],[-1,1]];
        for (let i = 0; i < this.gameState.length; i++){
            for (let j = 0; j < this.gameState[i].length; j++){
                let player = (this.gameState[i][j] === null) ? null : this.gameState[i][j].id;
                if (player !== null){
                    for (let k = 0; k < directions.length; k++){
                        let winner = this.checkDirection(directions[k], player, i, j);
                        if (winner !== null){ 
                            this.messages.push({
                                id: this.createUniqueId(), 
                                name: this.gameState[i][j].name, 
                                colour: this.gameState[i][j].colour, 
                                message: `Won the game!!`, 
                                time: this.getTime()
                            });
                            return winner;
                        }
                    }
                }
            }
        }
        
        return null;
    }

    getTime(){
        let today = new Date();
        return today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    }

    //dir[verDir][horDir]
    checkDirection(dir, player, startRow, startCol){
        let winLength = 4;
        let rowLength = this.gameState.length - 1;
        let colLength = this.gameState[0].length - 1;

        //check vertical has room
        if (((((winLength-1) * dir[0]) + startRow) > rowLength) || ((((winLength-1) * dir[0])  + startRow) < 0)){
            return null;
        }
        //check horizontal has room
        if (((((winLength-1) * dir[1]) + startCol) > colLength) || ((((winLength-1) * dir[1]) + startCol) < 0)){
            return null;
        }

        //we already know the player for the start cell. Check the player for the cells in the direction
        //and return null if the player changes.
        for (let i = 1; i < winLength; i++){
            let cellToCheck = this.gameState[startRow + (i * dir[0])][startCol + (i * dir[1])];
            if (cellToCheck === null || cellToCheck.id !== player){ 
                return null; 
            }
        }
        //we're here. We must have a winner!
        return {
            row: startRow, 
            col: startCol,
            dir: dir
        };
    }
};