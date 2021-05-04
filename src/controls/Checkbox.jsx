import React, { Component } from 'react';

class Checkbox extends Component {
    state = {
        choiceDisabled: false
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
                        onClick={this.props.handleChoiceClick}
                    />
                    <strong> &nbsp;{this.props.choice.value}</strong>
                </label>
            </div>
        );
    }
}

export default Checkbox;
