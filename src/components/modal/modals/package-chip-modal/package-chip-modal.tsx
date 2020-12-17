import Draggable from 'react-draggable';
import Graph from '../../../../utilities/graph/graph';
import Modal from '../../modal';
import React, { Component } from 'react';
import { ChipCategory, Gate, PinSide } from '../../../../model/circuit-builder.types';
import { SliderPicker } from 'react-color';
import './package-chip-modal.scss';

interface PackageChipModalProps {
    onSubmitCallback: (name: string, color: string, category: ChipCategory, graph: Graph<Gate>, description?: string) => void;
    onCloseCallback: () => void;
    defaultName: string;
    graph: Graph<Gate>;
}

interface PackageChipModalState {
    color: string;
    name: string;
    triggerRedraw: boolean;
}

class PackageChipModal extends Component<PackageChipModalProps, PackageChipModalState>{
    constructor(props: PackageChipModalProps) {
        super(props);
        this.state = { color: "#006400", name: props.defaultName, triggerRedraw: false };
    }

    onSubmit() {
        let name = (document.getElementById("name") as HTMLInputElement).value;
        let category = (document.getElementById("category") as HTMLSelectElement).value;
        let description = (document.getElementById("description") as HTMLInputElement).value;

        if (!name || name === '')
            name = this.props.defaultName;

        this.props.onSubmitCallback(name, this.state.color, category as ChipCategory, this.props.graph, description);
        this.props.onCloseCallback();
    }

    onPinDragStop(e: any, data: any, gate: Gate) {
        const elementsUnderMouse = document.elementsFromPoint(e.x, e.y);

        if (elementsUnderMouse.filter(elem => elem.classList.contains('pins-top')).length === 1)
            gate.pinSide = PinSide.Top;
        else if (elementsUnderMouse.filter(elem => elem.classList.contains('pins-right')).length === 1)
            gate.pinSide = PinSide.Right;
        else if (elementsUnderMouse.filter(elem => elem.classList.contains('pins-bottom')).length === 1)
            gate.pinSide = PinSide.Bottom;
        else if (elementsUnderMouse.filter(elem => elem.classList.contains('pins-left')).length === 1)
            gate.pinSide = PinSide.Left;

        this.setState({ triggerRedraw: !this.state.triggerRedraw });
    }

    getGatesForPinSide(side: PinSide) {
        return this.props.graph.nodes.filter(gate => gate.pinSide === side && !(gate.hidden === true) && (this.props.graph.edges.filter(wire => gate.id === wire.to).length === 0 || this.props.graph.edges.filter(wire => gate.id === wire.from).length === 0)); // later part for only getting exposed pins
    }

    getPinElementsForSide(side: PinSide): JSX.Element {
        return (
            <div className={`pin-side pins-${side.toLowerCase()}`}>
                {this.getGatesForPinSide(side).map(gate => {
                    return (
                        <Draggable key={gate.id} onStop={(e, data) => this.onPinDragStop(e, data, gate)} position={{ x: 0, y: 0 }} >
                            <div className="pin" title={gate.name}></div>
                        </Draggable>
                    );
                })}
            </div>
        );
    }

    render() {
        const style = { backgroundColor: this.state.color, height: Math.max(this.getGatesForPinSide(PinSide.Left).length, this.getGatesForPinSide(PinSide.Right).length) * 16 + 25, width: Math.max(this.getGatesForPinSide(PinSide.Top).length, this.getGatesForPinSide(PinSide.Bottom).length) * 16 + 40 };

        return (
            <Modal title="Package Chip" onClose={this.props.onCloseCallback}>
                <div className="package-chip-wrapper">
                    <input type="text" placeholder="Name" name="name" id='name' onChange={(e) => this.setState({ name: e.currentTarget.value !== '' ? e.currentTarget.value : this.props.defaultName })} />
                    <select id='category' defaultValue={ChipCategory.Other}>
                        {Object.keys(ChipCategory).map(category => {
                            return <option key={category} value={category}>{`Chips (${category})`}</option>
                        })}
                    </select>
                    <div id="color">
                        <SliderPicker color={this.state.color} onChange={(color) => this.setState({ color: color.hex })} />
                    </div>
                    <input type="text" placeholder="Description" name="descripton" id='description' />
                    <span id="pin-sorting-info">To modify the positions of the pins just drag them to any Pin side.</span>
                    <div className="pin-sorting-wrapper" id="pin-sorting">
                        <div className="chip chip-on-board" style={style}>
                            <span>{this.state.name}</span>
                            {this.getPinElementsForSide(PinSide.Top)}
                            {this.getPinElementsForSide(PinSide.Left)}
                            {this.getPinElementsForSide(PinSide.Bottom)}
                            {this.getPinElementsForSide(PinSide.Right)}
                        </div>
                    </div>
                    <button onClick={this.onSubmit.bind(this)} id='submit'>Add Blueprint</button>
                </div>
            </Modal >
        );
    }
}

export default PackageChipModal;