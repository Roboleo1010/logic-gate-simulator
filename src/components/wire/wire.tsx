import React, { Component } from 'react';
import { CircuitBuilderContext, Tool, Vector2, WireModel } from '../../model/circuit-builder.types';
import './wire.scss';

interface WireProps {
    wire: WireModel;
    context: CircuitBuilderContext;
    onWireDelete: (wire: WireModel) => void;
}

class Wire extends Component<WireProps> {

    render() {
        let startElement = document.querySelector(`[data-gateid='${this.props.wire.fromId}']`)?.getBoundingClientRect();
        let endElement = document.querySelector(`[data-gateid='${this.props.wire.toId}']`)?.getBoundingClientRect();

        if (!startElement || !endElement)
            return;

        let start: Vector2 = { x: startElement.left - this.props.context.boardTranslation.x + startElement.width / 2, y: startElement.top - this.props.context.boardTranslation.y + startElement.height / 2 };
        let end: Vector2 = { x: endElement.left - this.props.context.boardTranslation.x + startElement.width / 2, y: endElement.top - this.props.context.boardTranslation.y + endElement.height / 2 };

        let className = 'wire ';

        let clickEvent = () => { };
        if (this.props.context.isSimulationRunning) {
            if (this.props.wire.state)
                className += 'wire-true ';
            else
                className += 'wire-false ';
        }
        else {
            if (this.props.context.activeTool === Tool.Delete) {
                className += 'wire-tool-delete ';
                clickEvent = () => { this.props.onWireDelete(this.props.wire) };
            }
        }

        return (
            <svg className="wire-canvas">
                <line className={className} x1={start.x} y1={start.y} x2={end.x} y2={end.y} onClick={(clickEvent)} />
            </svg>
        );
    }
}

export default Wire;