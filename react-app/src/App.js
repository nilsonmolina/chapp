import React, { Component } from 'react';
import socketio from 'socket.io-client';
import './App.css';

import Welcome from './components/Welcome';
import Sidebar from './components/Sidebar/Sidebar';
import Messages from './components/Messages/Messages';
// import WebRTC from './components/WebRTC';

class App extends Component {
  static initialState = {
    socket: false,
    loggedIn: false,
    loginErr: 'Server is offline',
    username: '',
    users: [],
    rooms: [],
    messages: [],
    roomId: 1,
  };
  state = App.initialState;

  componentWillMount() {
    const socket = socketio.connect('127.0.0.1:5000');

    socket.on('connect', () => this.setState({ 
      socket,
      loginErr: '',
    }));

    // ----- LOGIN -----
    socket.on('usernameAccepted', (payload) => this.setState({
      loggedIn: true,
      username: payload.username,
      messages: payload.messages,
      rooms: payload.rooms,
    }, () => localStorage.username = this.state.username));

    socket.on('usersChanged', (users) => this.setState({ users }));

    // ----- MESSAGES -----    
    socket.on('messageCreated', (message) => this.setState((state) => ({ 
      messages: state.messages.concat(message),
    })));

    // ----- ERRORS -----
    socket.on('usernameTaken', (payload) => this.setState({
      loginErr: payload,
    }));

    socket.on('incorrectLogin', (payload) => this.setState({
      loginErr: payload,
    }));

    socket.on('disconnect', () => this.setState(App.initialState));
  };

  tryLogin = (username, password) => {
    if (!this.state.socket) return;
    this.state.socket.emit('tryLogin', { username, password });
  };

  trySignup = (username, password) => {
    if (!this.state.socket) return;
    this.state.socket.emit('trySignup', { username, password });
  };

  sendMessage = (body) => {
    if (!this.state.socket) return;
    const message = { body, roomId: this.state.roomId };
    this.state.socket.emit('createMessage', message);
  };

  changeRooms = (e) => {
    this.setState({ roomId: parseInt(e.target.id) || 0 });
  };

  render() {
    return (
      <div className="App">
        { !this.state.loggedIn || this.state.socket.disconnected
          ? <Welcome state={this.state} tryLogin={this.tryLogin} trySignup={this.trySignup} />
          : (
            <React.Fragment>
              <Sidebar
                users={this.state.users}
                rooms={this.state.rooms}
                changeRooms={this.changeRooms}
              />
              <Messages 
                username={this.state.username}
                messages={this.state.messages}
                sendMessage={this.sendMessage}
                roomId={this.state.roomId}
              />  
            </React.Fragment>
          )
        }
        {/* <WebRTC /> */}
      </div>
    );
  };
}

export default App;
