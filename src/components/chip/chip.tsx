import React, { Component } from "react";
import Draggable from "react-draggable";
import { ConnectorModel, Tool } from "../../model/circuit-builder.types";
import Connector from "../connector/connector";

import "./chip.scss";
import ChipModel from "../../model/chip-model";
import { GateType } from "../../simulation/simulator.types";

interface ChipProps {
    chip: ChipModel;
    activeTool: Tool;
    onConnectorClick: (connector: ConnectorModel) => void;
    onChipDelete: (chip: ChipModel) => void;
    onSwitchSwitched: (chip: ChipModel) => void;
    redraw: () => void;
}

interface ChipState {
    isSwitch: boolean;
}

class Chip extends Component<ChipProps, ChipState> {
    constructor(props: ChipProps) {
        super(props);

        this.state = { isSwitch: this.props.chip.gates.filter(gate => gate.type === GateType.Switch).length > 0 }
    }

    render() {
        let style = { backgroundColor: this.props.chip.blueprint.color };

        let connectors: JSX.Element[] = [];

        this.props.chip.connectors.forEach((connectorArray: ConnectorModel[]) => {
            connectorArray.forEach((connector: ConnectorModel, index) => {
                connectors.push(<Connector key={connector.id} connectorBlueprint={connector} connectorsForSideCount={connectorArray.length} connectorForSideIndex={index} onClick={this.props.onConnectorClick}></Connector>);
            });
        });

        let className = "chip chip-on-board ";

        if (this.props.activeTool === Tool.Move)
            className += "chip-tool-move ";
        else if (this.props.activeTool === Tool.Delete)
            className += "chip-tool-delete ";
        else if (this.props.activeTool === Tool.Simulate && this.state.isSwitch)
            className += "chip-type-switch ";

        let clickEvent = () => { };

        if (this.props.activeTool === Tool.Delete)
            clickEvent = () => { this.props.onChipDelete(this.props.chip) };
        else if (this.props.activeTool === Tool.Simulate && this.state.isSwitch)
            clickEvent = () => { this.props.onSwitchSwitched(this.props.chip) };


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