import React, { Component } from "react";
import ChipModel from "../../model/chip-model";
import ConnectorModel from "../../model/connector-model";
import { WireModel } from "../../model/wire-model";
import Chip from "../chip/chip";
import Wire from "../wire/wire";

import "./board.scss";

interface BoardProps {
    chips: ChipModel[];
    wires: WireModel[];
    onConnectorClicked: (connector: ConnectorModel) => void;

}

class Board extends Component<BoardProps>{
    redraw() {
        this.forceUpdate();
    }

    render() {
        return (
            <div className="board">
                {this.props.chips.map((chip, index) => {
                    return <Chip key={`${chip.name}_${index}`} chip={chip} onConnectorClick={this.props.onConnectorClicked} redraw={this.redraw.bind(this)} ></Chip>
                })}
                {this.props.wires.map((wire, index) => {
                    return <Wire key={`${wire.inputId}_${wire.outputId}`} wire={wire}></Wire>
                })}
            </div>);
    }
}

export default Board;