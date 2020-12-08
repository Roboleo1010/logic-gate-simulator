import ChipInstance from '../../model/chip-instance';
import CircuitBuilderContext from '../context/circuit-builder-context/circuit-builder-context';
import Draggable from 'react-draggable';
import Pin from '../pin/pin';
import React, { Component } from 'react';
import { Gate, GateRole, SignalDirection, Tool } from '../../model/circuit-builder.types';
import './chip.scss';

interface ChipProps {
    chip: ChipInstance;
    onChipDelete: (chip: ChipInstance) => void;
    redraw: () => void;
    onPinClicked: (gate: Gate) => void;
}

class Chip extends Component<ChipProps> {
    static contextType = CircuitBuilderContext;

    render() {
        let style = { backgroundColor: this.props.chip.blueprint.color };

        let pins: JSX.Element[] = [];

        let gatesIn = this.props.chip.graph.nodes.filter(gate => gate.signalDirection === SignalDirection.In && gate.role !== GateRole.InputActive && this.props.chip.graph.edges.filter(wire => gate.id === wire.to).length === 0);
        let gatesOut = this.props.chip.graph.nodes.filter(gate => gate.signalDirection === SignalDirection.Out && this.props.chip.graph.edges.filter(wire => gate.id === wire.from).length === 0);

        gatesIn.forEach((gate, index) => {
            pins.push(<Pin key={gate.id} gate={gate} pinsForSideCount={gatesIn.length} pinForSideIndex={index} onClick={this.props.onPinClicked}></Pin>);
        });

        gatesOut.forEach((gate, index) => {
            pins.push(<Pin key={gate.id} gate={gate} pinsForSideCount={gatesOut.length} pinForSideIndex={index} onClick={this.props.onPinClicked}></Pin>);
        });

        let className = 'chip chip-on-board ';

        if (!this.context.isSimulationRunning) {
            if (this.context.activeTool === Tool.Move)
                className += 'chip-tool-move ';
            else if (this.context.activeTool === Tool.Delete)
                className += 'chip-tool-delete ';
        }

        let startPos = this.props.chip.startPosition;
        if (startPos)
            this.props.chip.startPosition = undefined;

        let clickEvent = () => { };

        if (!this.context.isSimulationRunning && this.context.activeTool === Tool.Delete)
            clickEvent = () => { this.props.onChipDelete(this.props.chip) };

        return (
            <Draggable grid={[25, 25]} position={startPos} bounds={"parent"} cancel={".pin"} onStop={this.props.redraw} disabled={this.context.activeTool !== Tool.Move || this.context.isSimulationRunning}>
                <div data-chipid={this.props.chip.id} className={className} style={style} onClick={clickEvent}>
                    <span>{this.props.chip.blueprint.name}</span>
                    {pins}
                </div>
            </Draggable >
        );
    }
}

export default Chip;