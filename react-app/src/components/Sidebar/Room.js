import React from 'react';

const Room = (props) => (
  <div className="Room" onClick={props.changeRooms} id={props.roomId}>
    {props.name}
  </div>
);

export default Room
