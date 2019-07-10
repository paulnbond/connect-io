import React from 'react';

const Message = ({id, name, colour, message, time}) => {
    return (
        <div className='message' data-id={id}>
            <span className={`messageListName msg${colour}`}>{`${time} ${name}: `}</span>
            <span className='messageListMessage'>{message}</span>
        </div>
    );
}

export default Message;