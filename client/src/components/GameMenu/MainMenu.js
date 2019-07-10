import React from 'react';

const GameMainMenu = ({callback}) => (
    <div className='gameMenu'>
        <button className='menuBtn' onClick={()=>{callback('new')}}>New Game</button>
        <button className='menuBtn' onClick={()=>{callback('join')}}>Join Game</button>
    </div>
);

export default GameMainMenu;