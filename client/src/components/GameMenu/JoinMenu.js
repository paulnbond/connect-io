import React from 'react';

const GameJoinMenu = ({callback}) => (
    <div className='gameMenu'>
        <div className='menuInputBox'>
            <input type='text' id='joinId' />
            <button onClick={()=>{callback(document.getElementById('joinId').value)}}>Join Game</button>
        </div>
        <button className='menuBtn' onClick={()=>{callback('cancel')}}>Cancel</button>
    </div>
);

export default GameJoinMenu;