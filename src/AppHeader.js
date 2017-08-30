import React, { Component } from 'react';
import './AppHeader.css';

class AppHeader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="AppHeader">
        { this.props.connected ? "connected" : "disconnected" }
        <button className="ConnectButton" onClick={this.props.connect}>(Re)connect</button>
      </div>
    );
  }
}

export default AppHeader;
