import React, { Component } from 'react';

export default class Home extends Component {
    goToCode(){
        this.props.history.push('/test')
    }
    render() {
        return (
            <div>
                <button onClick={_=>this.goToCode()}>Start Coding</button>
            </div>
        );
    }
}