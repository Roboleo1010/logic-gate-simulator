import React, { Component } from "react";
import { WireModel } from "../../model/wire-model";

import "./wire.scss";

interface WireProps {
    wire: WireModel;
}

class Wire extends Component<WireProps> {
    render() {
        let startElement = document.querySelector(`[data-connectorid='${this.props.wire.inputId}']`)?.getBoundingClientRect();
        let endElement = document.querySelector(`[data-connectorid='${this.props.wire.outputId}']`)?.getBoundingClientRect();

        if (!startElement || !endElement)
            return;


        return (
            <svg className="wire-canvas">
                <line className="wire wire-on" x1={startElement?.left + startElement?.width / 2} y1={startElement?.top + startElement.height / 2} x2={endElement?.left + startElement?.width / 2} y2={endElement?.top + endElement.height / 2} />
            </svg>
        );
    }
}

export default Wire;