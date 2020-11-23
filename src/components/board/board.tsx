import React, { Component } from "react";
import ChipBlueprint from "../../model/chip-blueprint";
import Chip from "../chip/chip";

import "./board.scss";

interface BoardProps {
    chips: ChipBlueprint[];
}

class Board extends Component<BoardProps>{
    render() {
        return (
            <div className="board">
                {this.props.chips.map((chip, index) => {
                    return <Chip key={`${chip.name}_${index}`} chip={chip}></Chip>
                })}
            </div>);
    }
}

export default Board;