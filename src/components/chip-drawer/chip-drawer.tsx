import React, { Component } from "react";
import ChipBlueprint from "../../model/chip-blueprint";
import ChipPrefab from "../chip/chip-prefab";

import "./chip-drawer.scss";

interface ChipToolboxProps {
    chips: ChipBlueprint[];
}

class ChipDrawer extends Component<ChipToolboxProps> {
    render() {
        return (
            <div className="chip-drawer">
                {this.props.chips.map(chip => {
                    return <ChipPrefab chip={chip} key={chip.name}></ChipPrefab>;
                })}
            </div>
        );
    }
}

export default ChipDrawer;