import React from 'react';
import MessageList from './MessageList';
import CreateMessage from './CreateMessage';
import './Messages.css';

const Messages = (props) => (
  <section className="Messages">
    <MessageList username={props.username} messages={props.messages} roomId={props.roomId} />
    <CreateMessage sendMessage={props.sendMessage} />
  </section>
);

export default Messages;
