import CircuitBuilder from '../circuit-builder/circuit-builder';
import React, { Component } from 'react';
import './app.scss';

class App extends Component {
  render() {
    return (
      <div className="app">
        <CircuitBuilder />
      </div>
    );
  }
}

export default App;
