import ChipInstance from '../../model/chip-instance';
import React, { Component } from 'react';
import { ChipRole, CircuitBuilderContext, Gate, GateRole, PinSide, Tool, Vector2 } from '../../model/circuit-builder.types';
import './chip.scss';

interface ChipProps {
    chip: ChipInstance;
    context: CircuitBuilderContext;
    onChipDelete: (chip: ChipInstance) => void;
    redraw: () => void;
    onPinClicked: (gate: Gate) => void;
}

interface ChipState {
    position: Vector2;
}

class Chip extends Component<ChipProps, ChipState> {
    constructor(props: ChipProps) {
        super(props);

        this.state = { position: this.props.chip.startPosition }
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
                        if (gate.state === true)
                            className += 'pin-true ';
                        else
                            className += 'pin-false ';
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
        const minYSize = Math.max(this.getGatesForPinSide(PinSide.Left).length, this.getGatesForPinSide(PinSide.Right).length) * 20;
        const minXSize = Math.max(this.getGatesForPinSide(PinSide.Top).length, this.getGatesForPinSide(PinSide.Bottom).length) * 20;

        const style = {
            backgroundColor: this.props.chip.blueprint.color,
            minWidth: minXSize >= 100 ? minXSize : 100,
            minHeight: minYSize >= 50 ? minYSize : 50,
            transform: `translate(${this.state.position.x}px, ${this.state.position.y}px)`
        };

        let className = 'chip chip-on-board ';
        let clickEvent = () => { };

        if (this.props.context.isSimulationRunning) {
            if (this.props.chip.blueprint.role === ChipRole.Switch) {
                className += "chip-role-switch";

                let switchGate = this.props.chip.graph.nodes.find(gate => gate.role === GateRole.Switch && gate.firstLayer);
                clickEvent = () => { switchGate!.state = switchGate!.state ? false : true };
            }
        }
        else {
            if (this.props.context.activeTool === Tool.Move)
                className += 'chip-tool-move ';
            else if (this.props.context.activeTool === Tool.Delete) {
                className += 'chip-tool-delete ';
                clickEvent = () => { this.props.onChipDelete(this.props.chip) };
            }
        }

        let binaryDisplay: JSX.Element = <></>;
        if (this.props.chip.blueprint.role === ChipRole.BinaryDisplay && this.props.context.isSimulationRunning) {
            let result = 0;

            this.props.chip.graph.nodes.forEach(gate => {
                if (gate.state) result += Number(gate.data!);
            });

            binaryDisplay = <span className="binary-display">{result}</span>
        }

        let binaryInput: JSX.Element = <></>;
        if (this.props.chip.blueprint.role === ChipRole.BinaryInput) {
            const maxValue = Math.pow(2, this.props.chip.graph.nodes.length) - 1;

            const checkValidity = (e: any) => {
                if (!e.currentTarget.checkValidity()) {
                    const value = e.currentTarget.value;
                    if (value < 0)
                        e.currentTarget.value = 0;
                    else
                        e.currentTarget.value = maxValue;
                }
            };

            const setOutputs = (e: any) => {
                const binaryString: string = Number(e.currentTarget.value).toString(2);

                let map = new Map();
                let j = 0;
                for (let i = binaryString.length - 1; i >= 0; i--)
                    map.set(Math.pow(2, j++), binaryString[i]);

                this.props.chip.graph.nodes.forEach(gate => {
                    gate.state = map.get(Number(gate.data)) === "1";
                });
            };

            binaryInput = <div><input type="number" max={maxValue} min={0} defaultValue={0} onChange={(e) => { checkValidity(e); setOutputs(e) }} className="binary-input"></input></div >
        }

        return (
            // <Draggable grid={[5, 5]} position={startPos} bounds={"parent"} cancel={".pin"} onStop={this.props.redraw} disabled={this.props.context.activeTool !== Tool.Move || this.props.context.isSimulationRunning} >
            <div data-chipid={this.props.chip.id} className={className} style={style} onClick={clickEvent}>
                <span className="title">{this.props.chip.blueprint.name}</span>
                {binaryDisplay}
                {binaryInput}
                {this.getPinElementsForSide(PinSide.Top)}
                {this.getPinElementsForSide(PinSide.Left)}
                {this.getPinElementsForSide(PinSide.Bottom)}
                {this.getPinElementsForSide(PinSide.Right)}
            </div>
            // </Draggable >
        );
    }
}

export default Chip;