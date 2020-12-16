import Modal from '../../modal/modal';
import React, { Component } from 'react';
import { ChipCategory } from '../../../model/circuit-builder.types';
import { SliderPicker } from 'react-color';
import './package-chip-modal.scss';

interface PackageChipModalProps {
    onSubmitCallback: (name: string, color: string, category: ChipCategory, description?: string) => void;
    onCloseCallback: () => void;
    defaultName: string;
}

interface PackageChipModalState {
    color: string;
}

class PackageChipModal extends Component<PackageChipModalProps, PackageChipModalState>{
    constructor(props: PackageChipModalProps) {
        super(props);
        this.state = { color: "#006400" };
    }

    onSubmit() {
        let name = (document.getElementById("name") as HTMLInputElement).value;
        let category = (document.getElementById("category") as HTMLSelectElement).value;
        let description = (document.getElementById("description") as HTMLInputElement).value;

        if (!name || name === '')
            name = this.props.defaultName;

        this.props.onSubmitCallback(name, this.state.color, category as ChipCategory, description);
        this.props.onCloseCallback();
    }

    render() {
        return (
            <Modal title="Package Chip" onClose={this.props.onCloseCallback}>
                <div className="package-chip-wrapper">
                    <input type="text" placeholder="Name" name="name" id='name' />
                    <select id='category'>
                        {Object.keys(ChipCategory).map(category => {
                            return <option key={category} value={category}>{category}</option>
                        })}
                    </select>
                    <div id="color">
                        <SliderPicker color={this.state.color} onChange={(color) => this.setState({ color: color.hex })} />
                    </div>
                    <input type="text" placeholder="Description" name="descripton" id='description' />
                    <div className="pin-sorting-wrapper" id="pin-sorting">

                    </div>

                    <button onClick={this.onSubmit.bind(this)} id='submit'>Add Blueprint</button>
                </div>
            </Modal >
        );
    }
}

export default PackageChipModal;