import React, { Component } from 'react';

class Button extends Component {
    constructor(props){
        super();
    }
    render() {
        return (<button onClick={this.props.onClick} className="btn col form-control float-right btn-primary btn-lg"> {this.props.data.text}</button>);
    }
}

export default Button;