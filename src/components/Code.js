import React, { Component } from 'react';
import axios from 'axios';
import io from 'socket.io-client'

export default class Code extends Component {
    constructor(){
        super();
        this.state = {
            code: '',
            output: 'Output goes here',
            type: 'node',
            compiling : false
        }
    }

    componentDidMount(){
        this.socket = io();
        this.joinRoom();
        this.socket.on('changeCode', data =>{
            this.setState({
                code: data
            })
        });
        this.socket.on('compiling', data => {
            console.log(data);
            if(data.compiling){
                this.setState({
                    compiling : true
                })
            }else{
                this.setState({
                    output: data.output,
                    compiling : false
                })
            }
        })
    }

    joinRoom() {
        this.socket.emit('joinRoom', {
            room: this.props.match.params.id
        })
    }
    
    changeCode = (e) => {
        const {value} = e.target
        this.setState(
            {
                code: value
            },_=>
            this.socket.emit('changeCode', {
                room: this.props.match.params.id,
                code: this.state.code
            })
        )

    }

    compile = () => {
        const body = {
            code: this.state.code, 
            room: this.props.match.params.id, 
            type: this.state.type 
        }
        this.socket.emit('compile', body);
    }

    render() {
        return (
            <div class="code_container">
                <div className='left'>
                    <div className="button_container">
                        <button disabled={this.state.compiling} onClick={this.compile}>Run</button>
                    </div>
                    <textarea className='code_area' value={this.state.code} onChange={this.changeCode}/>
                </div>
                <div className='left'>
                    <div className='output' >
                        {this.state.output}
                    </div>
                    <div className='video'></div>
                </div>
            </div>
        );
    }
}