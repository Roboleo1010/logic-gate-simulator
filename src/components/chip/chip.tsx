import React, { Component } from "react";
import Draggable from "react-draggable";
import ChipBlueprint from "../../model/chip-blueprint";

import "./chip.scss";

interface ChipProps {
    chip: ChipBlueprint;
}

class Chip extends Component<ChipProps> {
    render() {
        let style = { backgroundColor: this.props.chip.color };

        return (
            <Draggable grid={[25, 25]}>
                <div className="chip chip-on-board" style={style}>
                    <span>
                        {this.props.chip.name}
                    </span>
                </div>
            </Draggable>
        );
    }
}

export default Chip;