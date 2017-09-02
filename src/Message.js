import React, { Component } from 'react';
import Card from './Card';
import RaisedButton from 'material-ui/RaisedButton';
import './Message.css';

class Message extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.scrollToBottom();
  }

  componentDidUpdate() {
    this.props.scrollToBottom();
  }

  render() {
    var content = this.props.msg.content;
    var inner = null;
    if (content instanceof Object) {
      if (content.type === 'card') {
        inner = <Card scrollToBottom={this.props.scrollToBottom}
                      content={content} />;
      }
    }
    else {
      inner = content;
    }

    var direction = this.props.msg.isIncoming ? "Incoming" : "Outgoing";
    return (
      <div>
        <div className={"BubbleOuter " + direction}>
          <div className={"Bubble MessageBubble " + direction}>
            { inner }
          </div>
        </div>
      </div>
    );
  }
}

export default Message;
