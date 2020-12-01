import React, { Component } from "react";
import ChipModel from "../../model/chip-model";
import { ConnectorModel, Tool } from "../../model/circuit-builder.types";
import Simulation from "../../simulation/simulation";
import { Gate, Wire as WireSimulation } from "../../simulation/simulator.types";
import Chip from "../chip/chip";
import Wire from "../wire/wire";

import "./board.scss";

interface BoardProps {
    chips: ChipModel[];
    wires: WireSimulation[];
    activeTool: Tool;
    onConnectorClicked: (connector: ConnectorModel) => void;
    onChipDelete: (id: ChipModel) => void;
}

class Board extends Component<BoardProps>{
    redraw() {
        this.forceUpdate();
    }

    simulate() {
        console.log("Preparing Simulation");

        let gates: Gate[] = [];

        this.props.chips.forEach(chip => {
            chip.gates.forEach(gate => {
                gates.push(gate);
            });
        });

        new Simulation(gates, this.props.wires).simulate();
    }

    render() {
        return (
            <div className="board">
                {this.props.chips.map(chip => {
                    return <Chip key={chip.id} chip={chip} onConnectorClick={this.props.onConnectorClicked} redraw={this.redraw.bind(this)} activeTool={this.props.activeTool} onChipDelete={this.props.onChipDelete} ></Chip>
                })
                }
                {
                    this.props.wires.map(wire => {
                        return <Wire key={`${wire.inputId}_${wire.outputId}`} wire={wire}></Wire>
                    })
                }
            </div >);
    }
}

export default Board;