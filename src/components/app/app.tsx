import React, { Component } from 'react';
import CircuitBuilder from '../circuit-builder/circuit-builder';

import './app.scss';

class App extends Component {
  render() {
    return (
      <div className="app">
        <CircuitBuilder></CircuitBuilder>
      </div>
    );
  }
}

export default App;
