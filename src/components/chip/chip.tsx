import React, { Component } from "react";
import Draggable from "react-draggable";
import ChipBlueprint from "../../model/chip-blueprint";
import Connector from "../connector/connector";

import "./chip.scss";
import ConnectorBlueprint from "../../model/connector-blueprint";

interface ChipProps {
    chip: ChipBlueprint;
}

class Chip extends Component<ChipProps> {
    render() {
        let style = { backgroundColor: this.props.chip.color };

        let connectors: JSX.Element[] = [];

        this.props.chip.getConnectorArrays().forEach((connectorArray: ConnectorBlueprint[]) => {
            connectorArray.forEach((connector: ConnectorBlueprint, index) => {
                connectors.push(<Connector key={connector.name} connectorBlueprint={connector} connectorsForSideCount={connectorArray.length} connectorForSideIndex={index} ></Connector>);
            });
        });

        return (
            <Draggable grid={[25, 25]}>
                <div className="chip chip-on-board" style={style}>
                    <span>{this.props.chip.name}</span>
                    {connectors}
                </div>
            </Draggable>
        );
    }
}

export default Chip;