import React, { Component } from "react";
import ChipModel from "../../model/chip-model";
import { ConnectorModel } from "../../model/circuit-builder.types";
import Simulation from "../../simulation/simulation";
import { Gate, Wire as WireSimulation } from "../../simulation/simulator.types";
import Chip from "../chip/chip";
import Wire from "../wire/wire";

import "./board.scss";

interface BoardProps {
    chips: ChipModel[];
    wires: WireSimulation[];
    onConnectorClicked: (connector: ConnectorModel) => void;
}

class Board extends Component<BoardProps>{
    redraw() {
        this.forceUpdate();
    }

    simulate() {
        console.log("Preparing Simulation");

        let gates: Gate[] = [];
        let wires: WireSimulation[] = [];

        //   Demo SImulation
        // let factory = new ChipFactory();

        // let in1: Gate = { id: "IN1", type: GateType.Controlled, state: TriState.True, inputs: [] };
        // let out1: Gate = { id: "OUT1", type: GateType.Relay, state: TriState.False, inputs: [] };
        // let not = factory.buildNOTChip(in1.id);

        // gates.push(in1, out1);
        // gates.push(...factory.gates);
        // wires.push({ outputId: "OUT1", inputId: not[0] });


        this.props.chips.forEach(chip => {
            chip.gates.forEach(gate => {
                gates.push(gate);
            });
        });

        wires = this.props.wires;

        new Simulation(gates, wires).simulate();
    }

    render() {
        return (
            <div className="board">
                {this.props.chips.map(chip => {
                    return <Chip key={chip.id} chip={chip} onConnectorClick={this.props.onConnectorClicked} redraw={this.redraw.bind(this)} ></Chip>
                })}
                {this.props.wires.map(wire => {
                    return <Wire key={`${wire.inputId}_${wire.outputId}`} wire={wire}></Wire>
                })}
                <div style={{ right: 0, bottom: 95, position: 'absolute', backgroundColor: 'red', color: 'white', cursor: 'pointer' }} className="unselectable" onClick={this.simulate.bind(this)}>Simulate</div>
            </div>);
    }
}

export default Board;