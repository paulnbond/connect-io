const game = require('./game.js');
const express = require('express');
const app = express();
const router = express.Router();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const port = process.env.port || 19890;

router.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    socket.on('disconnect', function(){});
});

router.get('/creategame', (req, res) => {
    res.json(
        game.createGame()
    );
});

router.get('/joingame/:game/', (req, res) => {
    let result = game.joinGame(req.params.game);
    io.emit('playerjoined', result);
    res.json(result);
});

router.get('/resetgame/:game/', (req, res) => {
    let result = game.resetGame(req.params.game);
    io.emit('resetgame', result);
    res.json(result);
});

router.get('/listplayers/:game', (req, res) => {
    res.json({
        players: game.listPlayers(req.params.game)
    });
});

router.get('/cellclick/:game/:player/:row/:col', (req, res) => {
    let result = game.cellClick(req.params.game, req.params.player, req.params.row, req.params.col);
    io.emit('gameupdate', result);
    res.json(result);
});

router.get('/playerleave/:game/:player', (req, res) => {
    if (req.params.game !== 'null' && req.params.player !== 'null'){
        let result = game.removePlayer(req.params.game, req.params.player);
        if (result !== null){
            //return the new players turn
            io.emit('removeplayer', {
                player: req.params.player,
                game: result.game, 
                turn: result.turn
            });
        }
    }
});

app.use('/api/', router);

app.use(express.static(__dirname));

const server = http.listen(port, ()=>{
    console.log(`connect.io started successfully and listening on port ${port}`);
});