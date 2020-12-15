import ChipInstance from '../../model/chip-instance';
import Draggable from 'react-draggable';
import Pin from '../pin/pin';
import React, { Component } from 'react';
import { CircuitBuilderContext, Gate, GateRole, SignalDirection, Tool } from '../../model/circuit-builder.types';
import { TriState } from '../../simulation/simulator.types';
import './chip.scss';

interface ChipProps {
    chip: ChipInstance;
    context: CircuitBuilderContext;
    onChipDelete: (chip: ChipInstance) => void;
    redraw: () => void;
    onPinClicked: (gate: Gate) => void;
}

interface ChipState {
    switch?: Gate;
}

class Chip extends Component<ChipProps, ChipState> {
    constructor(props: ChipProps) {
        super(props);

        this.state = {
            switch: this.props.chip.graph.nodes.find(gate => gate.role === GateRole.Switch && gate.isFirstLayer),
        }
    }

    render() {
        let pins: JSX.Element[] = [];

        const gatesIn = this.props.chip.graph.nodes.filter(gate => gate.signalDirection === SignalDirection.In && !(gate.hidden === true) && this.props.chip.graph.edges.filter(wire => gate.id === wire.to).length === 0);
        const gatesOut = this.props.chip.graph.nodes.filter(gate => gate.signalDirection === SignalDirection.Out && !(gate.hidden === true) && this.props.chip.graph.edges.filter(wire => gate.id === wire.from).length === 0);

        gatesIn.forEach((gate, index) => {
            pins.push(<Pin key={gate.id} context={this.props.context} gate={gate} pinsForSideCount={gatesIn.length} pinForSideIndex={index} startWire={this.props.onPinClicked}></Pin>);
        });

        gatesOut.forEach((gate, index) => {
            pins.push(<Pin key={gate.id} context={this.props.context} gate={gate} pinsForSideCount={gatesOut.length} pinForSideIndex={index} startWire={this.props.onPinClicked}></Pin>);
        });

        const style = { backgroundColor: this.props.chip.blueprint.color, height: Math.max(gatesIn.length, gatesOut.length) * 16 + 20 };

        let className = 'chip chip-on-board ';

        if (!this.props.context.isSimulationRunning) {
            if (this.props.context.activeTool === Tool.Move)
                className += 'chip-tool-move ';
            else if (this.props.context.activeTool === Tool.Delete)
                className += 'chip-tool-delete ';
        }

        let startPos = this.props.chip.startPosition;
        if (startPos)
            this.props.chip.startPosition = undefined;

        let clickEvent = () => { };

        if (this.props.context.isSimulationRunning) {
            if (this.state.switch !== undefined) {
                className += "chip-role-switch";
                clickEvent = () => { this.state.switch!.state = this.state.switch!.state === TriState.True ? TriState.False : TriState.True };
            }
        }
        else {
            if (this.props.context.activeTool === Tool.Delete)
                clickEvent = () => { this.props.onChipDelete(this.props.chip) };
        }

        return (
            <Draggable grid={[5, 5]} position={startPos} bounds={"parent"} cancel={".pin"} onStop={this.props.redraw} disabled={this.props.context.activeTool !== Tool.Move || this.props.context.isSimulationRunning}>
                <div data-chipid={this.props.chip.id} className={className} style={style} onClick={clickEvent}>
                    <span>{this.props.chip.blueprint.name}</span>
                    {pins}
                </div>
            </Draggable >
        );
    }
}

export default Chip;