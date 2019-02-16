import React from 'react';

const Message = (props) => (
  <div className={`Message ${props.message.username === props.username ? "me" : "" }`}>
    <div className="bubble">
      <p>{props.message.body}</p>
      
      <div className="meta">
        <span className="name">{props.message.username}</span>
        <span className="date">
          {new Date(props.message.dateCreated)
            .toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, '$1$3')}
        </span>
      </div>
    </div>
  </div>
);

export default Message;