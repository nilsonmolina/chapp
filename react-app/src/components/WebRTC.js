import React from 'react';

class WebRTC extends React.Component {
  componentDidMount() {
    const mediaStreamConstraints = {
      video: true,
    };
    // Initializes media stream.
    navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
      .then(this.gotLocalMediaStream)
      .catch(this.handleLocalMediaStreamError);
  };

  // Handles success by adding the MediaStream to the video element.
  gotLocalMediaStream = (mediaStream) => {
    this.messageList.srcObject = mediaStream;
  };
  // Handles error by logging a message to the console with the error message.
  handleLocalMediaStreamError = (error) => {
    console.log('navigator.getUserMedia error: ', error);
  }

  render() {
    return (
      <section className="WebRTC">
        <button onClick={this.record}>Record</button>
        <video autoPlay playsInline ref={e => this.messageList = e}></video>
      </section>
    );
  };
}

export default WebRTC;