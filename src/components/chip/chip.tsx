import React, { Component } from "react";
import Draggable from "react-draggable";
import { ConnectorModel, Gate, GateFunction, Tool } from "../../model/circuit-builder.types";
import Connector from "../connector/connector";
import ChipModel from "../../model/chip-model";
import CircuitBuilderContext from "../context/circuit-builder-context/circuit-builder-context";

import "./chip.scss";

interface ChipProps {
    chip: ChipModel;
    activeTool: Tool;
    onConnectorClick: (connector: ConnectorModel) => void;
    onChipDelete: (chip: ChipModel) => void;
    onSwitchSwitched: (gate: Gate) => void;
    redraw: () => void;
}

interface ChipState {
    input?: Gate;
}

class Chip extends Component<ChipProps, ChipState> {
    static contextType = CircuitBuilderContext;

    constructor(props: ChipProps) {
        super(props);

        this.state = {
            input: this.props.chip.gates.find(gate => gate.function === GateFunction.Input),
        };
    }

    render() {
        let style = { backgroundColor: this.props.chip.chipBlueprint.color };

        let connectors: JSX.Element[] = [];

        this.props.chip.connectors.forEach((connectorArray: ConnectorModel[]) => {
            connectorArray.forEach((connector: ConnectorModel, index) => {
                connectors.push(<Connector key={connector.id} connector={connector} connectorsForSideCount={connectorArray.length} connectorForSideIndex={index} onClick={this.props.onConnectorClick}></Connector>);
            });
        });

        let className = 'chip chip-on-board ';

        if (this.context.isSimulationRunning) {
            if (this.state.input)
                className += 'chip-type-switch ';
        }
        else {
            if (this.props.activeTool === Tool.Move)
                className += 'chip-tool-move ';
            else if (this.props.activeTool === Tool.Delete)
                className += 'chip-tool-delete ';
        }

        let clickEvent = () => { };

        if (!this.context.isSimulationRunning && this.props.activeTool === Tool.Delete)
            clickEvent = () => { this.props.onChipDelete(this.props.chip) };
        else if (this.context.isSimulationRunning && this.state.input)
            clickEvent = () => { this.props.onSwitchSwitched(this.state.input!) }

        return (
            <Draggable grid={[25, 25]} bounds={"parent"} cancel={".connector"} onStop={this.props.redraw} disabled={this.props.activeTool !== Tool.Move || this.context.isSimulationRunning}>
                <div data-chipid={this.props.chip.chipId} className={className} style={style} onClick={clickEvent}>
                    <span>{this.props.chip.chipBlueprint.name}</span>
                    {connectors}
                </div>
            </Draggable >
        );
    }
}

export default Chip;