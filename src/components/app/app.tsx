import React, { Component } from 'react';
import Simulator from '../../simulation/simulator';
import Board from '../board/board';
import Drawer from '../drawer/drawer';

import './app.scss';

class App extends Component {

  componentDidMount() {
    Simulator.getInstance().simulate();
  }

  render() {
    return (
      <div className="App">
        <Board></Board>
        <Drawer></Drawer>
      </div>
    );
  }
}

export default App;
