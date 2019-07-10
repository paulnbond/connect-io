import React from 'react';
import GameRow from './GameRow.js';

const GameBoard = ({board, cb}) => {
    return (
        <div className='gb'>
            {board.map((row, i) => 
                (<GameRow key={i} {...{cells: row, row: i, cb: cb}} />)
            )}
        </div>
    );
}

export default GameBoard;