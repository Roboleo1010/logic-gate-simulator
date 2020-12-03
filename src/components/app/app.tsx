import React, { Component } from 'react';
import CircuitBuilder from '../circuit-builder/circuit-builder';
import { CircuitBuilderProvider } from '../context/circuit-builder-context/circuit-builder-context';

import './app.scss';

class App extends Component {
  render() {
    return (
      <div className="app">
        <CircuitBuilderProvider value={{ isSimulationRunning: false }}>
          <CircuitBuilder></CircuitBuilder>
        </CircuitBuilderProvider>
      </div>
    );
  }
}

export default App;
