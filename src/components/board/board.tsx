import Chip from '../chip/chip';
import ChipInstance from '../../model/chip-instance';
import Draggable from '../draggable/draggable';
import React, { Component } from 'react';
import Wire from '../wire/wire';
import { CircuitBuilderContext, Gate, Tool, Vector2, WireModel } from '../../model/circuit-builder.types';
import './board.scss';

interface BoardProps {
    chips: ChipInstance[];
    wires: WireModel[];
    context: CircuitBuilderContext;
    redraw: () => void;
    onPinClicked: (gate: Gate) => void;
    onChipDelete: (chip: ChipInstance) => void;
    onWireDelete: (id: WireModel) => void;
}

interface BoardState {
    scale: number;
    translation: Vector2;
}

class Board extends Component<BoardProps, BoardState>{
    constructor(props: BoardProps) {
        super(props);

        this.state = { scale: 1, translation: { x: 0, y: 0 } };
    }

    scroll(e: any) {
        let newScale = this.state.scale;

        if (e.deltaY > 0) //up
            newScale = newScale - 0.05;
        else
            newScale = newScale + 0.05;

        if (newScale < 0.4)
            newScale = 0.4;
        else if (newScale > 1.4)
            newScale = 1.4;

        this.setState({ scale: newScale });
    }

    onDrag(translation: Vector2) {
        this.setState({ translation: translation });
        this.props.context.boardTranslation = translation;
    }

    render() {
        //  const style = { transform: `scale(${this.state.scale})` }; //onWheel={(e) => this.scroll(e)}

        return (
            <Draggable className="board" confine='fullscreen' classNameDragging="board-pan-active" classNameEnabled="board-pan-inactive" enabled={this.props.context.activeTool === Tool.Pan} onDrag={this.onDrag.bind(this)}>
                {this.props.chips.map(chip => {
                    return <Chip context={this.props.context} key={chip.id} chip={chip} onChipDelete={this.props.onChipDelete} onPinClicked={this.props.onPinClicked} redraw={this.props.redraw} ></Chip>
                })}
                {this.props.wires.map(wire => {
                    return <Wire context={this.props.context} key={`${wire.fromId}_${wire.toId}`} wire={wire} onWireDelete={this.props.onWireDelete} ></Wire>
                })}
            </Draggable>
        );
    }
}

export default Board;