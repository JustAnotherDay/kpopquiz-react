import React, { Component } from 'react';

class ChoiceItem extends Component {
  constructor(props) {
    super(props);

    this.state = ({
      choiceDisabled: false
    })
  }

  render() {
    return (
      <div className="list-group-item list-group-item-action" 
        style={{ background: this.props.choice.bgColor }}>
        <label>
          <input
            key={this.props.id}
            type="radio"
            name="choice"
            defaultChecked={this.props.checked}
            disabled={this.props.choice.choiceDisabled}
            value={this.props.choice.value}
            onClick={this.props.onChildClick}
          />
               <strong> &nbsp;{this.props.choice.value}</strong>
        </label>
      </div>
    );
  }
}

export default ChoiceItem;