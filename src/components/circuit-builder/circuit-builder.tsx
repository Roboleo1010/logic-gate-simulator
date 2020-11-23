import React, { Component } from 'react';
import ChipBlueprint from '../../model/chip-blueprint';
import Simulator from '../../simulation/simulator';
import Board from '../board/board';
import Toolbox from '../toolbox/toolbox';

import './circuit-builder.scss';

interface CircuitBuilderState {
    chips: ChipBlueprint[];
}

class CircuitBuilder extends Component<{}, CircuitBuilderState> {

    constructor(props: any) {
        super(props);

        this.state = { chips: [] };
    }

    componentDidMount() {
        Simulator.getInstance().simulate();
    }

    addChipToBoard(chip: ChipBlueprint) {
        let newChips = this.state.chips;
        newChips.push(chip)

        this.setState({ chips: newChips })
    }

    render() {
        return (
            <div className="circuit-builder">
                <Board chips={this.state.chips}></Board>
                <Toolbox onChipClicked={this.addChipToBoard.bind(this)}></Toolbox>
            </div>
        );
    }
}

export default CircuitBuilder;
