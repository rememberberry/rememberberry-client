import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import './Card.css';

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showingFront: true
    };
  }

  flip(event) {
    this.setState({ showingFront: !this.state.showingFront });
  }

  componentDidMount() {
    this.props.scrollToBottom();
  }

  componentDidUpdate() {
    this.props.scrollToBottom();
  }

  render() {
    var card = this.state.showingFront ?
      this.props.content.front : this.props.content.back;

    return (
      <div className="Card">
        <div dangerouslySetInnerHTML={{ __html: card }} />
        { this.state.showingFront ? 
          <div className="ShowAnswerContainer">
            <RaisedButton primary={true}
                          className="ShowAnswerButton"
                          onClick={() => this.flip()}>
              Show Answer
            </RaisedButton>
          </div>: null }
      </div>
    );
  }
}

export default Card;
