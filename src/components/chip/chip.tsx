import React, { Component } from "react";
import Draggable from "react-draggable";
import ChipModel from "../../model/chip-model";
import { ConnectorModel } from "../../model/circuit-builder.types";
import Connector from "../connector/connector";

import "./chip.scss";

interface ChipProps {
    chip: ChipModel;
    onConnectorClick: (connector: ConnectorModel) => void;
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

        return (
            <Draggable grid={[25, 25]} bounds={"parent"} cancel={".connector"} onStop={this.props.redraw}>
                <div data-chipid={this.props.chip.id} className="chip chip-on-board" style={style}>
                    <span>{this.props.chip.blueprint.name}</span>
                    {connectors}
                </div>
            </Draggable>
        );
    }
}

export default Chip;