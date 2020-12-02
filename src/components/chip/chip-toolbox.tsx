import React, { Component } from "react";
import { ChipBlueprint } from "../../model/circuit-builder.types";
import "./chip.scss";

interface ChipToolboxProps {
    chipBlueprint: ChipBlueprint;
    onChipClicked: (chip: ChipBlueprint) => void;
}

class ChipToolbox extends Component<ChipToolboxProps> {
    render() {
        let style = { backgroundColor: this.props.chipBlueprint.color };

        return (
            <div className="chip chip-on-toolbox" style={style} title={this.props.chipBlueprint.description} onClick={() => this.props.onChipClicked(this.props.chipBlueprint)}>
                <span>
                    {this.props.chipBlueprint.name}
                </span>
            </div>
        );
    }
}

export default ChipToolbox;