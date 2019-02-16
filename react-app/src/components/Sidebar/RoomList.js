import React from 'react';
import Room from './Room';

const RoomList = (props) => (
  <section className="RoomList">
    <h3>Chat Rooms</h3>
    <div className="rooms">
      {props.rooms.map((r) => (
        <Room key={r.id} name={r.name} changeRooms={props.changeRooms} roomId={r.id} />
      ))}
    </div>
  </section>
);

export default RoomList;
