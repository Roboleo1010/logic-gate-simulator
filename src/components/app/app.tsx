import React, { Component } from 'react';
import Simulator from '../../simulation/simulator';
import Board from '../board/board';
import Toolbox from '../toolbox/toolbox';

import './app.scss';

class App extends Component {

  componentDidMount() {
    Simulator.getInstance().simulate();
  }

  render() {
    return (
      <div className="App">
        <Board></Board>
        <Toolbox></Toolbox>
      </div>
    );
  }
}

export default App;
