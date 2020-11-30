import React, { Component } from "react";
import { ChipBlueprint } from "../../model/circuit-builder.types";
import "./chip.scss";

interface ChipToolboxProps {
    chip: ChipBlueprint;
    onChipClicked: (chip: ChipBlueprint) => void;
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