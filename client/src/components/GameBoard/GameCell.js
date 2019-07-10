import React from 'react';

const GameCell = ({cell, row, col, cb}) => {
    let cellColour = (cell === null) ? 'white' : cell.colour;
    return (
        <div className={`gc ${cellColour}`} 
            data-row={row} 
            data-col={col} 
            onClick={()=>{cb({row: row, col: col})}}
        />
    );
};

export default GameCell;