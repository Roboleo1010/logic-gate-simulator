import React, { Component } from "react";
import ChipModel from "../../model/chip-model";
import { ConnectorModel, Tool } from "../../model/circuit-builder.types";
import { Gate, Wire as WireSimulation } from "../../simulation/simulator.types";
import Chip from "../chip/chip";
import Wire from "../wire/wire";

import "./board.scss";

interface BoardProps {
    chips: ChipModel[];
    wires: WireSimulation[];
    activeTool: Tool;
    isSimulationRunning: boolean;
    onConnectorClicked: (connector: ConnectorModel) => void;
    onChipDelete: (id: ChipModel) => void;
    onWireDelete: (id: WireSimulation) => void;
    onSwitchSwitched: (gate: Gate) => void;
    redraw: () => void;
}

class Board extends Component<BoardProps>{
    render() {
        return (
            <div className="board">
                {this.props.chips.map(chip => {
                    return <Chip key={chip.id} chip={chip} activeTool={this.props.activeTool} isSimulationRunning={this.props.isSimulationRunning} onConnectorClick={this.props.onConnectorClicked} redraw={this.props.redraw} onChipDelete={this.props.onChipDelete} onSwitchSwitched={this.props.onSwitchSwitched} ></Chip>
                })
                }
                {
                    this.props.wires.map(wire => {
                        return <Wire key={`${wire.inputId}_${wire.outputId}`} wire={wire} activeTool={this.props.activeTool} onWireDelete={this.props.onWireDelete}></Wire>
                    })
                }
            </div >);
    }
}

export default Board;