import React from 'react';
import Message from './Message.js';

const Messages = ({game}) => {
    if (game.hasOwnProperty('messages')){
        return(<div className='messageBoard'>
            {game.messages.map((message, i) => 
                (<Message key={i} {...message} />)
            )}
        </div>);
    } else {
        return (<div className='messageBoard'></div>);
    }
};

export default Messages;