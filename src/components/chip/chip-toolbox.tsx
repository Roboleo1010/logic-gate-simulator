import React, { Component } from "react";
import ChipModel from "../../model/chip-model";
import "./chip.scss";

interface ChipToolboxProps {
    chip: ChipModel;
    onChipClicked: (chip: ChipModel) => void;
}

class ChipToolbox extends Component<ChipToolboxProps> {
    render() {
        let style = { backgroundColor: this.props.chip.color };

        return (
            <div className="chip chip-on-toolbox" style={style} onClick={() => this.props.onChipClicked(this.props.chip)}>
                <span>
                    {this.props.chip.name}
                </span>
            </div>
        );
    }
}

export default ChipToolbox;