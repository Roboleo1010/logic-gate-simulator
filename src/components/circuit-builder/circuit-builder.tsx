import React, { Component } from 'react';
import Simulator from '../../simulation/simulator';
import Board from '../board/board';
import Toolbox from '../toolbox/toolbox';

import './circuit-builder.scss';

class CircuitBuilder extends Component {

    componentDidMount() {
        Simulator.getInstance().simulate();
    }

    render() {
        return (
            <div className="circuit-builder">
                <Board></Board>
                <Toolbox></Toolbox>
            </div>
        );
    }
}

export default CircuitBuilder;
