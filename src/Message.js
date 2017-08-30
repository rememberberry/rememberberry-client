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

    var replies = this.props.msg.replies || [];
    var replyButtons = replies.map((reply) => {
      var label = null;
      var msg = null;
      if (typeof reply === 'string') { msg = reply; label = reply; }
      else { msg = reply.msg; label = reply.label }

      return (
        <RaisedButton key={label}
                      backgroundColor={reply.color || ''}
                      className={"ReplyButton"}
                      onClick={()=> this.props.send(msg)}>
          {label}
        </RaisedButton>
      );
    });

    var isIncoming = this.props.msg.isIncoming;
    var direction = isIncoming ? "Incoming" : "Outgoing";
    return (
      <div>
        <div className={"BubbleOuter " + direction}>
          <div className={"Bubble MessageBubble " + direction}>
            { inner }
          </div>
        </div>
        <div className="ReplyBubbleOuter">
          { this.props.isLastMessage && isIncoming && replyButtons.length > 0 ? 
            <div className="Bubble ReplyButtonsBubble">
              { replyButtons }
            </div> : null
          }
        </div>
      </div>
    );
  }
}

export default Message;
