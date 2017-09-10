import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import AppHeader from './AppHeader';
import Message from './Message';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: false,
      messages: [],
      ws: null,
      text: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  componentWillMount() {
    // Called once when creating page
    this.connect();
  }

  connect() {
    if (this.state.ws !== null) {
      this.state.ws.close();
      this.resetState();
    }

    const ws = new WebSocket("ws://"+window.location.host+"/messages");
    ws.onopen = (event) => {
      this.setState({ws: ws, connected: true});
      var auth_token = localStorage.getItem('auth_token');
      if (auth_token) {
        auth_token = `auth_token=${auth_token}`;
      }
      ws.send(auth_token || ''); // send auth_token or empty message to get started
    };
    ws.onmessage = (event) => {
      this.handleMessage(JSON.parse(event.data));
    };
    ws.onerror = (event) => {
      this.setState({ws: null, connected: false});
    };
    ws.onclose = (event) => {
      this.setState({ws: null, connected: false});
    };
  }

  handleMessage(msg) {
    if (typeof msg.content === "string" && msg.content.startsWith('auth_token=')) {
      localStorage.setItem('auth_token', msg.content.split('auth_token=')[1])
      return;
    }
    let prevMessages = this.state.messages.slice();
    msg.isIncoming = true;
    prevMessages.push(msg);

    this.setState({messages: prevMessages});
  }

  handleChange(event) {
    this.setState({text: event.target.value});
  }

  handleSend(event) {
    var msg = this.state.text;
    var num = parseInt(msg);
    if (this.enumerate && !isNaN(num) && num >= 1 && num <= this.enumerate.length) {
      msg = this.enumerate[num-1];
    }
    this.enumerate = null;

    var lastMessage = this.state.messages[this.state.messages.length-1];
    var silent = false;
    if (lastMessage) {
      silent = lastMessage.silent_response;
    }

    if (msg !== '') {
      this.state.ws.send(msg);
      let prevMessages = this.state.messages.slice();
      prevMessages.push({'isIncoming': false, 'content': msg, silent: silent});
      this.setState({text: '', messages: prevMessages});
    }
  }

  handleKeyDown(event) {
    if(event.key === 'Enter') {
      event.preventDefault();
      this.handleSend();
    }
  }

  scrollToBottom() {
    const node = ReactDOM.findDOMNode(this.messagesEnd);
    if (!node) return;
    node.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    const send = (msg) => {
      this.state.text = msg;
      this.handleSend();
    }

    let messages = [];
    for (var i = 0; i < this.state.messages.length; i++) {
      messages.push(
        <Message isLastMessage={i === this.state.messages.length-1}
                 send={send}
                 msg={this.state.messages[i]}
                 scrollToBottom={this.scrollToBottom}
                 key={i} />);
    };

    var lastMessage = this.state.messages[this.state.messages.length-1];
    var replies = null;
    var responseType = "text";
    if (lastMessage && lastMessage.isIncoming) {
      responseType = lastMessage.response_type || "text";
      var enumerate = lastMessage.enumerate === undefined ?  true : lastMessage.enumerate;
      if (enumerate) this.enumerate = [];
      var replyButtons = (lastMessage.replies || []).map((reply, i) => {
        var label = null;
        var msg = null;
        if (typeof reply === 'string') { msg = reply; label = reply; }
        else { msg = reply.msg; label = reply.label }
        if (enumerate) {
          this.enumerate.push(msg);
          label = (i+1) + ': ' + label;
        }
        return (
          <RaisedButton key={label}
                        backgroundColor={reply.color || ''}
                        className={"ReplyButton"}
                        onClick={()=> send(msg)}>
            {label}
          </RaisedButton>
        );
      });

      replies = <div className="ReplyBubbleOuter">
        <div className="Bubble ReplyButtonsBubble">
          { replyButtons }
        </div>
      </div>

    }

    return (
      <MuiThemeProvider>
        <div className="App">
          <AppHeader connected={this.state.connected} connect={() => this.connect()} 
                     send={send} />
          <div className="Chat">
              { messages }
              { replies }
              <div className="ChatTextBox">
                <TextField type={responseType}
                           value={this.state.text}
                           onChange={this.handleChange}
                           onKeyDown={this.handleKeyDown}/>
                <RaisedButton className="SendButton" onClick={this.handleSend}>Send</RaisedButton>
              </div>
          </div>
          <div style={{ float:"left", clear: "both" }}
               ref={(el) => { this.messagesEnd = el; }}>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
