import React, { Component } from 'react';
import logo from './logo.svg';
import router from './router';
import './App.css';
class App extends Component {
  render() {
    return (
      <div className="App">
        {router}
      </div>
    );
  }
}

export default App;
