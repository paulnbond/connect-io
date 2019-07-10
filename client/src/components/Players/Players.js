import React from 'react';
import Player from './Player.js';

const Players = ({game, turn}) => {
    if (game.hasOwnProperty('players')){
        return(<div className='playerBoard'>
            {game.players.map((player, i) => 
                (<Player key={i} {...{player: player, turn: turn}} />)
            )}
        </div>);
    } else {
        return(<div className='playerBoard'></div>);
    }
};

export default Players;