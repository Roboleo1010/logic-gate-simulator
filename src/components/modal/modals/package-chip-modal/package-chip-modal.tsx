import Graph from '../../../../utilities/graph/graph';
import Modal from '../../modal';
import React, { Component } from 'react';
import { ChipCategory, Gate, PinSide } from '../../../../model/circuit-builder.types';
import { ReactSortable } from 'react-sortablejs';
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

    pinsLeft: Gate[];
    pinsRight: Gate[];
    pinsTop: Gate[];
    pinsBottom: Gate[];
}

class PackageChipModal extends Component<PackageChipModalProps, PackageChipModalState>{
    constructor(props: PackageChipModalProps) {
        super(props);

        this.state = {
            color: "#006400",
            name: props.defaultName,
            pinsTop: this.getGatesForPinSide(PinSide.Top),
            pinsBottom: this.getGatesForPinSide(PinSide.Bottom),
            pinsLeft: this.getGatesForPinSide(PinSide.Left),
            pinsRight: this.getGatesForPinSide(PinSide.Right)
        };
    }

    getGatesForPinSide(side: PinSide) {
        return this.props.graph.nodes.filter(gate => gate.pinSide === side && !(gate.hidden === true) && (this.props.graph.edges.filter(wire => gate.id === wire.to).length === 0 || this.props.graph.edges.filter(wire => gate.id === wire.from).length === 0)); // later part for only getting exposed pins
    }

    onSubmit() {
        let name = (document.getElementById("name") as HTMLInputElement).value;
        let category = (document.getElementById("category") as HTMLSelectElement).value;
        let description = (document.getElementById("description") as HTMLInputElement).value;

        if (!name || name === '')
            name = this.props.defaultName;

        //build graph with new gate position
        let graph = this.props.graph;

        graph.nodes.forEach(gate => {
            if (this.state.pinsLeft!.find(pin => gate.id === pin.id))
                gate.pinSide = PinSide.Left;
            else if (this.state.pinsRight.find(pin => gate.id === pin.id))
                gate.pinSide = PinSide.Right;
            else if (this.state.pinsTop.find(pin => gate.id === pin.id))
                gate.pinSide = PinSide.Top;
            else if (this.state.pinsBottom.find(pin => gate.id === pin.id))
                gate.pinSide = PinSide.Bottom;
        });

        this.props.onSubmitCallback(name, this.state.color, category as ChipCategory, graph, description);
        this.props.onCloseCallback();
    }

    getPinElementsForSide(side: PinSide): JSX.Element {
        const calssName = `pin-side pins-${side.toLowerCase()}`;
        return (
            <>
                {side === PinSide.Left &&
                    <ReactSortable className={calssName} list={this.state.pinsLeft} setList={(newstate) => this.setState({ pinsLeft: newstate })} group="modal-package-chip-pins">
                        {this.state.pinsLeft.map(gate => {
                            return <div key={gate.id} className="pin" title={gate.name}></div>
                        })}
                    </ReactSortable>
                }
                {side === PinSide.Right &&
                    <ReactSortable className={calssName} list={this.state.pinsRight} setList={(newstate) => this.setState({ pinsRight: newstate })} group="modal-package-chip-pins">
                        {this.state.pinsRight.map(gate => {
                            return <div key={gate.id} className="pin" title={gate.name}></div>
                        })}
                    </ReactSortable>
                }
                {side === PinSide.Top &&
                    <ReactSortable className={calssName} list={this.state.pinsTop} setList={(newstate) => this.setState({ pinsTop: newstate })} group="modal-package-chip-pins">
                        {this.state.pinsTop.map(gate => {
                            return <div key={gate.id} className="pin" title={gate.name}></div>
                        })}
                    </ReactSortable>
                }
                {side === PinSide.Bottom &&
                    <ReactSortable className={calssName} list={this.state.pinsBottom} setList={(newstate) => this.setState({ pinsBottom: newstate })} group="modal-package-chip-pins">
                        {this.state.pinsBottom.map(gate => {
                            return <div key={gate.id} className="pin" title={gate.name}></div>
                        })}
                    </ReactSortable>
                }
            </>
        );
    }

    render() {
        const minYSize = Math.max(this.getGatesForPinSide(PinSide.Left).length, this.getGatesForPinSide(PinSide.Right).length) * 20;
        const minXSize = Math.max(this.getGatesForPinSide(PinSide.Top).length, this.getGatesForPinSide(PinSide.Bottom).length) * 20;

        const style = {
            backgroundColor: this.state.color,
            minWidth: minXSize >= 100 ? minXSize : 100,
            minHeight: minYSize >= 50 ? minYSize : 50
        };

        return (
            <Modal title="Package Chip" onClose={this.props.onCloseCallback}>
                <div className="package-chip-wrapper">
                    <input type="text" placeholder="Name" name="name" maxLength={35} id='name' onChange={(e) => this.setState({ name: e.currentTarget.value !== '' ? e.currentTarget.value : this.props.defaultName })} autoFocus />
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