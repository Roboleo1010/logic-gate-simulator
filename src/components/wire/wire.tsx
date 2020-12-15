import React, { Component } from 'react';
import { CircuitBuilderContext, Tool, WireModel } from '../../model/circuit-builder.types';
import { TriState } from '../../simulation/simulator.types';
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

        let className = 'wire ';

        let clickEvent = () => { };
        if (this.props.context.isSimulationRunning) {
            switch (this.props.wire.state) {
                case TriState.True:
                    className += 'wire-true ';
                    break;
                case TriState.False:
                    className += 'wire-false ';
                    break;
            }
        }
        else {
            if (this.props.context.activeTool === Tool.Delete) {
                className += 'wire-tool-delete ';
                clickEvent = () => { this.props.onWireDelete(this.props.wire) };
            }
        }

        return (
            <svg className="wire-canvas">
                <line className={className} x1={startElement?.left + startElement?.width / 2} y1={startElement?.top + startElement.height / 2} x2={endElement?.left + startElement?.width / 2} y2={endElement?.top + endElement.height / 2} onClick={(clickEvent)} />
            </svg>
        );
    }
}

export default Wire;