import React, { Component } from "react";
import ConnectorBlueprint, { ConnectorDirection, ConnectorSide } from "../../model/connector-blueprint";
import "./connector.scss";

interface ConnectorProps {
    connectorBlueprint: ConnectorBlueprint;
    connectorsForSideCount: number;
    connectorForSideIndex: number;
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



        return (<div className={className} style={style}></div>);
    }
}

export default Connector;