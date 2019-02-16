import React from 'react';
import User from './User';

const UserList = (props) => (
  <section className="UserList">
    <h3>Connected Users - ({props.users.length})</h3>
    <div className="users">
      {props.users.map((u) => (
        <User key={u.socketId} name={u.name} />
      ))}
    </div>
  </section>
);

export default UserList;
