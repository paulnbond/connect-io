import React, { Component } from 'react';
import GameMainMenu from '../GameMenu/MainMenu.js';
import GameJoinMenu from '../GameMenu/JoinMenu.js';
import Players from '../Players/Players.js';
import Messages from '../Messages/Messages.js';
import GameBoard from '../GameBoard/GameBoard.js';
import socketIOClient from 'socket.io-client';

export default class GameClient extends Component{
    constructor(props){
        super(props);

        this.gameStates = {
            MAINMENU    : 'mainmenu',
            JOINMENU    : 'joinmenu',
            LOADING     : 'loading',
            PLAYING     : 'playing',
            ENDED       : 'ended'
		};

        this.state = {
            gameState: (props.match.params.id) ? this.gameStates.LOADING : this.gameStates.MENU,
			game: (props.match.params.id) ? {id: props.match.params.id} : null,
			player: null,
			turn: null
		};
		
		this.socket = {
			response: false,
			endpoint: 'http://localhost:19890'
		};

        this.apiCall = this.apiCall.bind(this);
		this.menuClick = this.menuClick.bind(this);
		this.cellClick = this.cellClick.bind(this);
		this.resetGame = this.resetGame.bind(this);
        this.render = this.render.bind(this);
    }

    componentWillMount() {
        if (this.state.game !== null){
			this.apiCall(`./api/joingame/${this.state.game.id}`)
				.then((response) => {
					this.setState({
						gameState: this.gameStates.PLAYING,
						game: response.game,
						player: response.player,
						turn: response.turn
					})
				}
			);
        }
    }

    componentDidMount() {
		const socket = socketIOClient(this.socket.endpoint);
    	socket.on('playerjoined', data => {
			this.setState({
				game: data.game,
				turn: data.turn
			});
		});

		socket.on('gameupdate', data => {
			this.setState({
				game: data.game,
				turn: data.turn
			});
		});

		socket.on('removeplayer', data => {
			this.setState({
				game: data.game
			});
		});

		socket.on('resetgame', data => {
			this.setState({
				game: data.game,
				turn: data.turn
			});
		});
    }

    apiCall(url){
		return new Promise((resolve) => {
			fetch(url)
				.then((response) => response.json())
				.then(function(json) {
					resolve(json);
				});
		});
    }

    menuClick(btn){
        switch(btn){
            case 'new':
				this.apiCall('./api/creategame')
					.then((response) => {
						this.setState({
							gameState: this.gameStates.PLAYING,
							game: response.game,
							player: response.player,
							turn: response.player.id
						})
					}
				);
                break;
            case 'join':
                this.setState({gameState: this.gameStates.JOINMENU});
				break;
			case 'cancel':
				this.setState({gameState: this.gameStates.MAINMENU});
				break;
            default:
                window.location.href = `${window.location.href}${btn}`;
                break;
        }
	}
	
	cellClick(cell){
		if (this.state.turn === this.state.player.id){
			this.apiCall(`/api/cellclick/${this.state.game.id}/${this.state.player.id}/${cell.row}/${cell.col}`)
				.then((data) => {
					this.setState({
						game: data.game,
						turn: data.turn,
						gameState: (data.winner !== null) ? this.gameStates.ENDED : this.gameStates.PLAYING
					});
				}
			);
		}
	}

	resetGame(){
		this.apiCall(`/api/resetGame/${this.state.game.id}`)
			.then((data) => {
				this.setState({
					game: data.game,
					gameState: this.gameStates.PLAYING
				});
			}
		);
	}

    render(){
        switch (this.state.gameState){
            case this.gameStates.LOADING:
                return(
					<div className='gameContainer'>
                    	<div>Loading game with ID: {this.state.game.id}</div>
					</div>
                );
            case this.gameStates.PLAYING:
                return(
					<div className='gameContainer'>
						<div className='gameBoard'>
							<GameBoard {...{board: this.state.game.gameState, cb: this.cellClick}} />
						</div>
						<Players {...this.state} />
						<Messages {...this.state} />
					</div>
                );
            case this.gameStates.ENDED:
                return(
					<div className='gameContainer'>
						<div className='gameBoard'>
                    		<div>Game Over. Play again?</div>
							<button onClick={()=>{this.resetGame()}}>Yes</button>
							<button onClick={()=>{window.location.href='./'}}>No</button>
						</div>
						<Players {...this.state} />
						<Messages {...this.state} />
					</div>
                );
            case this.gameStates.JOINMENU:
                return(
					<div className='gameContainer'>
                    	<GameJoinMenu {...{callback:this.menuClick}} />
					</div>
                );
            default:
                return(
					<div className='gameContainer'>
                    	<GameMainMenu {...{callback:this.menuClick}} />
					</div>
                );
        }
    }
}