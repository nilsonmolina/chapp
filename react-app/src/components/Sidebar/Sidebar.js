import React from 'react';
import UserList from './UserList';
import RoomList from './RoomList';
import './Sidebar.css';


const Sidebar = (props) => (
  <section className="Sidebar">
    <input type="checkbox" id="sidebar-toggle"/>

    <label htmlFor="sidebar-toggle" className="mobile-button">
      <div className="lines"></div>
      <div className="lines"></div>
      <div className="lines"></div>
    </label>

    <div className="heading">
      <h2>ch<span>app.</span></h2>
      <div className="subtitle">A realtime chat application</div>
    </div>
    
    <div className="sidebar-items">
      <RoomList rooms={props.rooms} changeRooms={props.changeRooms} />
      <UserList users={props.users} />
    </div>
  </section>
);

export default Sidebar;
