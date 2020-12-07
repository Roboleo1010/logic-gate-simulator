import CircuitBuilder from '../circuit-builder/circuit-builder';
import React, { Component } from 'react';
import { CircuitBuilderProvider } from '../context/circuit-builder-context/circuit-builder-context';
import { Tool } from '../../model/circuit-builder.types';
import './app.scss';

class App extends Component {
  render() {
    return (
      <div className="app">
        <CircuitBuilderProvider value={{ isSimulationRunning: false, activeTool: Tool.Move }}>
          <CircuitBuilder></CircuitBuilder>
        </CircuitBuilderProvider>
      </div>
    );
  }
}

export default App;
