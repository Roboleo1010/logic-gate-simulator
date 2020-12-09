import React, { Component } from 'react';
import { CircuitBuilderContext, Gate, SignalDirection } from '../../model/circuit-builder.types';
import { TriState } from '../../simulation/simulator.types';
import './pin.scss';

interface PinProps {
    gate: Gate;
    pinsForSideCount: number;
    pinForSideIndex: number;
    context: CircuitBuilderContext;
    onClick: (gate: Gate) => void;
}

class Pin extends Component<PinProps>{

    render() {
        let className = "pin ";
        let style;

        if (this.props.gate.signalDirection === SignalDirection.In) {
            className += 'pin-side-left ';
            style = { top: `calc(${(100 / (this.props.pinsForSideCount + 1)) * (this.props.pinForSideIndex + 1)}% - 8px)` }
        }
        else if (this.props.gate.signalDirection === SignalDirection.Out) {
            className += 'pin-side-right ';
            style = { top: `calc(${(100 / (this.props.pinsForSideCount + 1)) * (this.props.pinForSideIndex + 1)}% - 8px)` }
        }

        if (this.props.gate.error === true)
            className += "pin-error ";

        if (this.props.context.isSimulationRunning) {
            switch (this.props.gate.state) {
                case TriState.True:
                    className += 'pin-true ';
                    break;
                case TriState.False:
                    className += 'pin-false ';
                    break;
                case TriState.Floating:
                    className += 'pin-floating ';
                    break;
            }
        }


        return (<div data-gateid={this.props.gate.id} className={className} style={style} title={this.props.gate.id} onClick={() => this.props.onClick(this.props.gate)}></div >);
    }
}

export default Pin;