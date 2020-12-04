import React, { Component } from "react";
import { ConnectorModel, ConnectorSide } from "../../model/circuit-builder.types";
import { TriState } from "../../simulation/simulator.types";
import CircuitBuilderContext from "../context/circuit-builder-context/circuit-builder-context";

import "./connector.scss";

interface ConnectorProps {
    connector: ConnectorModel;
    connectorsForSideCount: number;
    connectorForSideIndex: number;
    onClick: (connector: ConnectorModel) => void;
}

class Connector extends Component<ConnectorProps>{
    static contextType = CircuitBuilderContext;

    render() {
        let className = "connector ";
        let style;

        switch (this.props.connector.side) {
            case ConnectorSide.Top:
                className += 'connector-side-top ';
                style = { left: `calc(${(100 / (this.props.connectorsForSideCount + 1)) * (this.props.connectorForSideIndex + 1)}% - 8px)` }
                break;
            case ConnectorSide.Bottom:
                className += 'connector-side-bottom ';
                style = { left: `calc(${(100 / (this.props.connectorsForSideCount + 1)) * (this.props.connectorForSideIndex + 1)}% - 8px)` }
                break;
            case ConnectorSide.Left:
                className += 'connector-side-left ';
                style = { top: `calc(${(100 / (this.props.connectorsForSideCount + 1)) * (this.props.connectorForSideIndex + 1)}% - 8px)` }
                break;
            case ConnectorSide.Right:
                className += 'connector-side-right ';
                style = { top: `calc(${(100 / (this.props.connectorsForSideCount + 1)) * (this.props.connectorForSideIndex + 1)}% - 8px)` }
                break;
        }

        if (this.context.isSimulationRunning)
            switch (this.props.connector.gate.state) {
                case TriState.True:
                    className += 'connector-true ';
                    break;
                case TriState.False:
                    className += 'connector-false ';
                    break;
                case TriState.Floating:
                    className += 'connector-floating ';
                    break;
            }

        if (this.props.connector.error)
            className += 'connector-error ';

        return (<div data-connectorid={this.props.connector.id} className={className} style={style} title={this.props.connector.gate.name} onClick={() => this.props.onClick(this.props.connector)}></div >);
    }
}

export default Connector;