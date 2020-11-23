import React, { Component } from "react";
import ChipBlueprint from "../../model/chip-blueprint";
import "./chip.scss";

interface ChipToolboxProps {
    chip: ChipBlueprint;
}

class ChipToolbox extends Component<ChipToolboxProps> {
    render() {
        let style = { backgroundColor: this.props.chip.color };

        return (
            <div className="chip chip-on-toolbox" style={style}>
                <span>
                    {this.props.chip.name}
                </span>
            </div>
        );
    }
}

export default ChipToolbox;