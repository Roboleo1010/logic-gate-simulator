import Chip from '../chip/chip';
import ChipInstance from '../../model/chip-instance';
import React, { Component } from 'react';
import Wire from '../wire/wire';
import { CircuitBuilderContext, Gate, WireModel } from '../../model/circuit-builder.types';
import './board.scss';

interface BoardProps {
    chips: ChipInstance[];
    wires: WireModel[];
    context: CircuitBuilderContext;
    redraw: () => void;
    onPinClicked: (gate: Gate) => void;
    onChipDelete: (chip: ChipInstance) => void;
    onWireDelete: (id: WireModel) => void;
}

class Board extends Component<BoardProps>{
    render() {
        return (
            <div className="board">
                {this.props.chips.map(chip => {
                    return <Chip context={this.props.context} key={chip.id} chip={chip} onChipDelete={this.props.onChipDelete} onPinClicked={this.props.onPinClicked} redraw={this.props.redraw} ></Chip>
                })}
                {this.props.wires.map(wire => {
                    return <Wire context={this.props.context} key={`${wire.fromId}_${wire.toId}`} wire={wire} onWireDelete={this.props.onWireDelete} ></Wire>// 
                })}
            </div >);
    }
}

export default Board;