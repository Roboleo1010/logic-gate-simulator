import React, { Component } from 'react';
import { CircuitBuilderContext, Gate, PinSide, Tool } from '../../model/circuit-builder.types';
import { TriState } from '../../simulation/simulator.types';
import './pin.scss';

interface PinProps {
    gate: Gate;
    pinsForSideCount: number;
    pinForSideIndex: number;
    context: CircuitBuilderContext;
    startWire: (gate: Gate) => void;
}

class Pin extends Component<PinProps>{
    renamePin() {
        let name = window.prompt("Pin name:", this.props.gate.name);

        if (!name || name === '')
            return;

        this.props.gate.name = name;
        this.forceUpdate();
    }

    render() {
        let className = "pin ";

        switch (this.props.gate.pinSide) {
            case PinSide.Top:
                className += 'pin-side-top ';
                break;
            case PinSide.Left:
                className += 'pin-side-left ';
                break;
            case PinSide.Right:
                className += 'pin-side-right ';
                break;
            case PinSide.Bottom:
                className += 'pin-side-bottom ';
                break;
        }
        let style = {};

        if (this.props.gate.pinSide === PinSide.Left || this.props.gate.pinSide === PinSide.Right)
            style = { top: `calc(${(100 / (this.props.pinsForSideCount + 1)) * (this.props.pinForSideIndex + 1)}% - 8px)` }
        else
            style = { left: `calc(${(100 / (this.props.pinsForSideCount + 1)) * (this.props.pinForSideIndex + 1)}% - 8px)` }

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
            }
        }

        let clickEvent = () => { };

        if (this.props.context.activeTool === Tool.Move) {
            clickEvent = () => this.props.startWire(this.props.gate);
            className += "pin-tool-move ";
        }
        else if (this.props.context.activeTool === Tool.Rename) {
            clickEvent = () => this.renamePin();
            className += "pin-tool-rename ";
        }

        return (<div data-gateid={this.props.gate.id} className={className} style={style} title={this.props.gate.name} onClick={clickEvent}></div >);
    }
}

export default Pin;