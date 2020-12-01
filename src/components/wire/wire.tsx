import React, { Component } from "react";
import { Tool } from "../../model/circuit-builder.types";
import { Wire as WireSimulation } from "../../simulation/simulator.types";

import "./wire.scss";

interface WireProps {
    wire: WireSimulation;
    activeTool: Tool;
    onWireDelete: (wire: WireSimulation) => void;
}

class Wire extends Component<WireProps> {
    render() {
        let startElement = document.querySelector(`[data-connectorid='${this.props.wire.inputId}']`)?.getBoundingClientRect();
        let endElement = document.querySelector(`[data-connectorid='${this.props.wire.outputId}']`)?.getBoundingClientRect();

        if (!startElement || !endElement)
            return;

        let className = "wire ";

        if (this.props.activeTool === Tool.delete)
            className += "wire-tool-delete";

        let clickEvent = () => { };

        if (this.props.activeTool === Tool.delete)
            clickEvent = () => { this.props.onWireDelete(this.props.wire) };

        return (
            <svg className="wire-canvas">
                <line className={className} x1={startElement?.left + startElement?.width / 2} y1={startElement?.top + startElement.height / 2} x2={endElement?.left + startElement?.width / 2} y2={endElement?.top + endElement.height / 2} onClick={clickEvent} />
            </svg>
        );
    }
}

export default Wire;