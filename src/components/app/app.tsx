import React, { Component } from 'react';
import Simulator from '../../simulation/simulator';

import './app.scss';

class App extends Component {

  componentDidMount() {
    let simulator = new Simulator();
    simulator.simulate();
  }

  render() {
    return (
      <div className="App">

      </div>
    );
  }
}

export default App;
