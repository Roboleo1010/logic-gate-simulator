import React, { Component } from "react";
import Draggable from "react-draggable";
import { ConnectorModel, Tool } from "../../model/circuit-builder.types";
import Connector from "../connector/connector";

import "./chip.scss";
import ChipModel from "../../model/chip-model";
import { Gate, GateFunction, TriState } from "../../simulation/simulator.types";

interface ChipProps {
    chip: ChipModel;
    activeTool: Tool;
    isSimulationRunning: boolean;
    onConnectorClick: (connector: ConnectorModel) => void;
    onChipDelete: (chip: ChipModel) => void;
    onSwitchSwitched: (gate: Gate) => void;
    redraw: () => void;
}

interface ChipState {
    switch?: Gate;
    output?: Gate;
    clock?: Gate;
}

class Chip extends Component<ChipProps, ChipState> {
    constructor(props: ChipProps) {
        super(props);

        this.state = {
            switch: this.props.chip.gates.find(gate => gate.function === GateFunction.Switch),
            output: this.props.chip.gates.find(gate => gate.function === GateFunction.Output),
            clock: this.props.chip.gates.find(gate => gate.function === GateFunction.Clock)
        };
    }

    render() {
        let style = { backgroundColor: this.props.chip.blueprint.color };

        let connectors: JSX.Element[] = [];

        this.props.chip.connectors.forEach((connectorArray: ConnectorModel[]) => {
            connectorArray.forEach((connector: ConnectorModel, index) => {
                connectors.push(<Connector key={connector.id} connector={connector} connectorsForSideCount={connectorArray.length} connectorForSideIndex={index} isSimulationRunning={this.props.isSimulationRunning} onClick={this.props.onConnectorClick}></Connector>);
            });
        });

        let className = "chip chip-on-board ";

        if (this.props.isSimulationRunning) {
            if (this.state.switch)
                className += "chip-type-switch ";

            //TODO: Decide if neccecary
            if (this.state.output) {
                if (this.state.output.state === TriState.True)
                    className += "chip-true ";
                else
                    className += "chip-false ";
            }

            //TODO: Decide if neccecary
            if (this.state.switch) {
                if (this.state.switch.state === TriState.True)
                    className += "chip-true ";
                else
                    className += "chip-false ";
            }

            //TODO: Decide if neccecary
            if (this.state.clock) {
                if (this.state.clock.state === TriState.True)
                    className += "chip-true ";
                else
                    className += "chip-false ";
            }
        }
        else {
            if (this.props.activeTool === Tool.Move)
                className += "chip-tool-move ";
            else if (this.props.activeTool === Tool.Delete)
                className += "chip-tool-delete ";
        }

        let clickEvent = () => { };

        if (!this.props.isSimulationRunning && this.props.activeTool === Tool.Delete)
            clickEvent = () => { this.props.onChipDelete(this.props.chip) };
        else if (this.props.isSimulationRunning && this.state.switch)
            clickEvent = () => { this.props.onSwitchSwitched(this.state.switch!) }

        return (
            <Draggable grid={[25, 25]} bounds={"parent"} cancel={".connector"} onStop={this.props.redraw} disabled={this.props.activeTool !== Tool.Move}>
                <div data-chipid={this.props.chip.id} className={className} style={style} onClick={clickEvent}>
                    <span>{this.props.chip.blueprint.name}</span>
                    {connectors}
                </div>
            </Draggable >
        );
    }
}

export default Chip;