import React from 'react';

const Player = ({player, turn}) => {
    let playersTurn = (player.id === turn) ? 'selected' : '';
    return (
        <div className='player'>
            <span className={`playerListColour ${player.colour}`} />
            <span data-id={player.id} className={`playerListName ${playersTurn}`}>{player.name}</span>
        </div>
    );
}

export default Player;