import React, { Component } from "react";
import Draggable from "react-draggable";
import ChipModel from "../../model/chip-model";
import Connector from "../connector/connector";
import ConnectorModel from "../../model/connector-model";
import Simulation from "../../simulation/simulation";

import "./chip.scss";

interface ChipProps {
    chip: ChipModel;
    onConnectorClick: (connector: ConnectorModel) => void;
    redraw: () => void;
}

class Chip extends Component<ChipProps> {
    constructor(props: ChipProps) {
        super(props);
        let simulation = Simulation.getInstance();

        simulation.addGates(this.props.chip.gates);
        simulation.addWires(this.props.chip.wires);
    }

    render() {
        let style = { backgroundColor: this.props.chip.color };

        let connectors: JSX.Element[] = [];

        this.props.chip.getConnectorArrays().forEach((connectorArray: ConnectorModel[]) => {
            connectorArray.forEach((connector: ConnectorModel, index) => {
                connectors.push(<Connector key={connector.name} connectorBlueprint={connector} connectorsForSideCount={connectorArray.length} connectorForSideIndex={index} onClick={this.props.onConnectorClick}></Connector>);
            });
        });

        return (
            <Draggable grid={[25, 25]} bounds={"parent"} cancel={".connector"} onStop={this.props.redraw}>
                <div className="chip chip-on-board" style={style}>
                    <span>{this.props.chip.name}</span>
                    {connectors}
                </div>
            </Draggable>
        );
    }
}

export default Chip;