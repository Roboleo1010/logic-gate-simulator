import React, { Component } from "react";
import ChipBlueprint from "../../model/chip-blueprint";
import Chip from "../chip/chip";

import "./board.scss";

interface BoardState {
    chips: ChipBlueprint[];
}

class Board extends Component<{}, BoardState>{

    constructor(props: any) {
        super(props);

        this.state = { chips: [new ChipBlueprint("AND", "#729B79")] }
    }

    render() {
        return (
            <div className="board">
                {this.state.chips.map(chip => {
                    return <Chip chip={chip}></Chip>
                })}
            </div>);
    }
}

export default Board;