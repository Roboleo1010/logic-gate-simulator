import React, { Component } from "react";
import { ConnectorDirection, ConnectorModel, ConnectorSide } from "../../model/circuit-builder.types";
import { TriState } from "../../simulation/simulator.types";
import "./connector.scss";

interface ConnectorProps {
    connectorBlueprint: ConnectorModel;
    connectorsForSideCount: number;
    connectorForSideIndex: number;
    onClick: (connector: ConnectorModel) => void;
}

class Connector extends Component<ConnectorProps>{
    //When two chips are connected add connectors to simulator.wireConnections

    render() {
        let className = "connector ";
        let style;

        switch (this.props.connectorBlueprint.side) {
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
        switch (this.props.connectorBlueprint.direction) {
            case ConnectorDirection.SignalIn:
                className += 'connector-direction-in ';
                break;
            case ConnectorDirection.SignalOut:
                className += 'connector-direction-out ';
                break;
        }

        switch (this.props.connectorBlueprint.state) {
            case TriState.True:
                className += 'connector-true';
                break;
            case TriState.False:
                className += 'connector-false';
                break;
            case TriState.Floating:
                className += 'connector-floating';
                break;
        }

        return (<div data-connectorid={this.props.connectorBlueprint.id} className={className} style={style} onClick={() => this.props.onClick(this.props.connectorBlueprint)}></div >);
    }
}

export default Connector;