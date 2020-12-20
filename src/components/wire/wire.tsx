import React, { Component } from 'react';
import { CircuitBuilderContext, Tool, Vector2, WireModel } from '../../model/circuit-builder.types';
import './wire.scss';

interface WireProps {
    wire: WireModel;
    context: CircuitBuilderContext;
    onWireDelete: (wire: WireModel) => void;
}

interface WireState {
    start: Vector2;
    end: Vector2;
}

class Wire extends Component<WireProps, WireState> {
    constructor(props: WireProps) {
        super(props);

        let startElement = document.querySelector(`[data-gateid='${this.props.wire.fromId}']`)?.getBoundingClientRect();
        let endElement = document.querySelector(`[data-gateid='${this.props.wire.toId}']`)?.getBoundingClientRect();

        if (startElement && endElement)
            this.state = {
                start: { x: startElement.left - this.props.context.boardTranslation.x + startElement.width / 2, y: startElement.top - this.props.context.boardTranslation.y + startElement.height / 2 },
                end: { x: endElement.left - this.props.context.boardTranslation.x + startElement.width / 2, y: endElement.top - this.props.context.boardTranslation.y + endElement.height / 2 }
            };
    }

    render() {
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
                <line className={className} x1={this.state.start.x} y1={this.state.start.y} x2={this.state.end.x} y2={this.state.end.y} onClick={(clickEvent)} />
            </svg>
        );
    }
}

export default Wire;