import CircuitBuilderContext from '../context/circuit-builder-context/circuit-builder-context';
import React, { Component } from 'react';
import { Tool, WireModel } from '../../model/circuit-builder.types';
import './wire.scss';

interface WireProps {
    wire: WireModel;
    onWireDelete: (wire: WireModel) => void;
}

class Wire extends Component<WireProps> {
    static contextType = CircuitBuilderContext;

    render() {
        let startElement = document.querySelector(`[data-gateid='${this.props.wire.fromId}']`)?.getBoundingClientRect();
        let endElement = document.querySelector(`[data-gateid='${this.props.wire.toId}']`)?.getBoundingClientRect();

        if (!startElement || !endElement)
            return;

        let className = 'wire wire-floating';

        if (this.context.activeTool === Tool.Delete)
            className += 'wire-tool-delete ';

        let clickEvent = () => { };

        if (this.context.activeTool === Tool.Delete)
            clickEvent = () => { this.props.onWireDelete(this.props.wire) };

        return (
            <svg className="wire-canvas">
                <line className={className} x1={startElement?.left + startElement?.width / 2} y1={startElement?.top + startElement.height / 2} x2={endElement?.left + startElement?.width / 2} y2={endElement?.top + endElement.height / 2} onClick={(clickEvent)} />
            </svg>
        );
    }
}

export default Wire;