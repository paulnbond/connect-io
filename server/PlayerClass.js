module.exports = class Player{
    constructor(colour, name = null, socketId = null){
        this.id = this.createUniqueId();
        this.colour = colour;
        this.name = name || `Player_${this.id}`;
        this.socketId = null;
    }

    createUniqueId(){
        return Math.random().toString(36).substr(2, 9);
    }
}