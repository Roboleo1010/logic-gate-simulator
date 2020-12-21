import ChipInstance from '../../model/chip-instance';
import Draggable from '../draggable/draggable';
import React, { Component } from 'react';
import { ChipRole, CircuitBuilderContext, Gate, GateRole, PinSide, Tool } from '../../model/circuit-builder.types';
import './chip.scss';

interface ChipProps {
    chip: ChipInstance;
    context: CircuitBuilderContext;
    isSelected: boolean,
    onChipDelete: (chip: ChipInstance) => void;
    redraw: () => void;
    onPinClicked: (gate: Gate) => void;
}

interface ChipState {
    chipRef: React.RefObject<HTMLDivElement>;
}

class Chip extends Component<ChipProps, ChipState> {
    constructor(props: ChipProps) {
        super(props);
        this.state = { chipRef: React.createRef() };
    }

    renamePin(gate: Gate) {
        let name = window.prompt("Pin name:", gate.name);

        if (!name || name === '')
            return;

        gate.name = name;
        this.forceUpdate();
    }

    //#region render helper
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

    getBinaryDisplay(): JSX.Element {
        if (this.props.chip.blueprint.role === ChipRole.BinaryDisplay && this.props.context.isSimulationRunning) {
            let result = 0;

            this.props.chip.graph.nodes.forEach(gate => {
                if (gate.state) result += Number(gate.data!);
            });

            return <span className="binary-display">{result}</span>
        }
        else
            return <></>
    }

    getBinaryInput(): JSX.Element {
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

            return <div><input type="number" max={maxValue} min={0} defaultValue={0} onChange={(e) => { checkValidity(e); setOutputs(e) }} className="binary-input"></input></div >
        }
        else
            return <></>;
    }
    //#endregion

    render() {
        const minYSize = Math.max(this.getGatesForPinSide(PinSide.Left).length, this.getGatesForPinSide(PinSide.Right).length) * 20;
        const minXSize = Math.max(this.getGatesForPinSide(PinSide.Top).length, this.getGatesForPinSide(PinSide.Bottom).length) * 20;

        const style = {
            backgroundColor: this.props.chip.blueprint.color,
            minWidth: minXSize >= 100 ? minXSize : 100,
            minHeight: minYSize >= 50 ? minYSize : 50,
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
            if (this.props.context.activeTool === Tool.Delete) {
                className += 'chip-tool-delete ';
                clickEvent = () => { this.props.onChipDelete(this.props.chip) };
            }
            if (this.props.isSelected)
                className += 'selected ';
        }

        //property determination
        // const startPos: Vector2 = { x: this.props.chip.position.x - this.props.context.boardTranslation.x, y: this.props.chip.position.y - this.props.context.boardTranslation.y };
        const dragEnabled = this.props.context.activeTool === Tool.Move && !this.props.context.isSimulationRunning;

        return (
            <Draggable confine='parent' className="absolute" classNameDragging='chip-move-active' classNameEnabled='chip-move-inactive' enabled={dragEnabled} startPosition={this.props.chip.position} onDrag={(translation) => this.props.chip.position = translation}>
                <div ref={this.state.chipRef} data-chipid={this.props.chip.id} className={className} style={style} onClick={clickEvent}>
                    <span>{this.props.chip.blueprint.name}</span>
                    {this.getBinaryDisplay()}
                    {this.getBinaryInput()}
                    {this.getPinElementsForSide(PinSide.Top)}
                    {this.getPinElementsForSide(PinSide.Left)}
                    {this.getPinElementsForSide(PinSide.Bottom)}
                    {this.getPinElementsForSide(PinSide.Right)}
                </div>
            </Draggable >
        );
    }

    componentDidMount() {
        const rect = this.state.chipRef.current!.getBoundingClientRect();
        this.props.chip.size = { x: rect.width, y: rect.height }; //FIXME: just once
    }
}

export default Chip;