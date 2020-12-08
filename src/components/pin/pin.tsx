import CircuitBuilderContext from '../context/circuit-builder-context/circuit-builder-context';
import React, { Component } from 'react';
import { Gate, SignalDirection } from '../../model/circuit-builder.types';
import './pin.scss';

interface PinProps {
    gate: Gate;
    pinsForSideCount: number;
    pinForSideIndex: number;
    onClick: (gate: Gate) => void;
}

class Pin extends Component<PinProps>{
    static contextType = CircuitBuilderContext;

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

        return (<div data-gateid={this.props.gate.id} className={className} style={style} title={this.props.gate.id} onClick={() => this.props.onClick(this.props.gate)}></div >);
    }
}

export default Pin;