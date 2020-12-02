import React, { Component } from "react";
import Draggable from "react-draggable";
import ChipModel from "../../model/chip-model";
import { ConnectorModel, Tool } from "../../model/circuit-builder.types";
import Connector from "../connector/connector";

import "./chip.scss";

interface ChipProps {
    chip: ChipModel;
    activeTool: Tool;
    onConnectorClick: (connector: ConnectorModel) => void;
    onChipDelete: (id: ChipModel) => void;
    redraw: () => void;
}

class Chip extends Component<ChipProps> {
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
            className += "chip-tool-move";
        else if (this.props.activeTool === Tool.Delete)
            className += "chip-tool-delete";

        let clickEvent = () => { };

        if (this.props.activeTool === Tool.Delete)
            clickEvent = () => { this.props.onChipDelete(this.props.chip) };

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