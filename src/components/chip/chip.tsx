import ChipInstance from '../../model/chip-instance';
import Draggable from 'react-draggable';
import React, { Component } from 'react';
import { CircuitBuilderContext, Gate, GateRole, PinSide, Tool } from '../../model/circuit-builder.types';
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

    renamePin(gate: Gate) {
        let name = window.prompt("Pin name:", gate.name);

        if (!name || name === '')
            return;

        gate.name = name;
        this.forceUpdate();
    }

    getGatesForPinSide(side: PinSide) {
        return this.props.chip.graph.nodes.filter(gate => gate.pinSide === side && !(gate.hidden === true) && (this.props.chip.graph.edges.filter(wire => gate.id === wire.to).length === 0 || this.props.chip.graph.edges.filter(wire => gate.id === wire.from).length === 0)); // later part for only getting exposed pins
    }

    getPinElementsForSide(side: PinSide): JSX.Element {
        return (
            <div className={`pin-side pins-${side.toLowerCase()}`}>
                {this.getGatesForPinSide(side).map((gate) => {
                    let className = "pin ";

                    if (gate.error === true)
                        className += "pin-error ";

                    if (this.props.context.isSimulationRunning) {
                        switch (gate.state) {
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
                        clickEvent = () => this.props.onPinClicked(gate);
                        className += "pin-tool-move ";
                    }
                    else if (this.props.context.activeTool === Tool.Rename) {
                        clickEvent = () => this.renamePin(gate);
                        className += "pin-tool-rename ";
                    }

                    return (<div data-gateid={gate.id} key={gate.id} className={className} title={gate.name} onClick={clickEvent}></div>);
                })}
            </div>
        );
    }

    render() {
        const gatesLeft = this.getGatesForPinSide(PinSide.Left);
        const gatesRight = this.getGatesForPinSide(PinSide.Right);
        const gatesTop = this.getGatesForPinSide(PinSide.Top);
        const gatesBottom = this.getGatesForPinSide(PinSide.Bottom);

        const style = { backgroundColor: this.props.chip.blueprint.color, height: Math.max(gatesLeft.length, gatesRight.length) * 16 + 25, width: Math.max(gatesTop.length, gatesBottom.length) * 16 + 40 };
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
                    {this.getPinElementsForSide(PinSide.Top)}
                    {this.getPinElementsForSide(PinSide.Left)}
                    {this.getPinElementsForSide(PinSide.Bottom)}
                    {this.getPinElementsForSide(PinSide.Right)}
                </div>
            </Draggable >
        );
    }
}

export default Chip;