import React from 'react';
import GameCell from './GameCell.js';

const GameRow = ({cells, row, cb}) => (
    <div className='gr'>
        {cells.map((cell, i) => 
            (<GameCell key={i} {...{cell: cell, row: row, col: i, cb: cb}} />)
        )}
    </div>
);

export default GameRow;