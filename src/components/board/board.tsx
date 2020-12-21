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

    isSelecting: boolean;
    selectionStart: Vector2;
    selectionEnd: Vector2;
}

class Board extends Component<BoardProps, BoardState>{
    constructor(props: BoardProps) {
        super(props);

        this.state = { isSelecting: false, scale: 1, translation: { x: 0, y: 0 }, selectionStart: { x: 0, y: 0 }, selectionEnd: { x: 0, y: 0 } };
    }

    // scroll(e: any) {
    //     let newScale = this.state.scale;

    //     if (e.deltaY > 0) newScale = newScale - 0.05;
    //     else newScale = newScale + 0.05;

    //     if (newScale < 0.4) newScale = 0.4;
    //     else if (newScale > 1.4) newScale = 1.4;

    //     this.setState({ scale: newScale });
    // }

    onDrag(translation: Vector2) {
        this.setState({ translation: translation });
        this.props.context.boardTranslation = translation;
    }

    //#region Selection box
    onSelectionStart(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (this.props.context.activeTool === Tool.Select) {
            const startPos: Vector2 = { x: e.clientX - this.props.context.boardTranslation.x, y: e.clientY - this.props.context.boardTranslation.y }
            this.setState({ selectionStart: startPos, selectionEnd: startPos, isSelecting: true });
        }
    }

    onSelectionDrag(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (!this.state.isSelecting)
            return;

        this.setState({ selectionEnd: { x: e.clientX - this.props.context.boardTranslation.x, y: e.clientY - this.props.context.boardTranslation.y } });
    }

    onSelectionEnd(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (!this.state.isSelecting)
            return;

        this.setState({ isSelecting: false });
    }

    isInSelection(chip: ChipInstance, top: number, bottom: number, left: number, right: number): boolean {
        if (chip.position.y + chip.size.y > top && chip.position.y < bottom &&
            chip.position.x + chip.size.x > left && chip.position.x < right)
            return true;
        else
            return false;
    }

    //#endregion

    render() {
        const top = Math.min(this.state.selectionStart.y, this.state.selectionEnd.y)
        const bottom = Math.max(this.state.selectionStart.y, this.state.selectionEnd.y)
        const left = Math.min(this.state.selectionStart.x, this.state.selectionEnd.x)
        const right = Math.max(this.state.selectionStart.x, this.state.selectionEnd.x)


        return (
            <Draggable className="board-size" confine='fullscreen' classNameDragging="board-pan-active" classNameEnabled="board-pan-inactive" enabled={this.props.context.activeTool === Tool.Pan} onDrag={this.onDrag.bind(this)} >
                <div className="board board-size" onMouseDown={this.onSelectionStart.bind(this)} onMouseMove={this.onSelectionDrag.bind(this)} onMouseUp={this.onSelectionEnd.bind(this)} onContextMenuCapture={(e) => { this.setState({ selectionStart: { x: 0, y: 0 }, selectionEnd: { x: 0, y: 0 } }); e.preventDefault(); return false; }}>
                    {
                        this.state.isSelecting &&
                        <svg className='selection-box'>
                            <rect x={Math.min(this.state.selectionStart.x, this.state.selectionEnd.x)}
                                y={Math.min(this.state.selectionStart.y, this.state.selectionEnd.y)}
                                width={Math.abs(this.state.selectionStart.x - this.state.selectionEnd.x)}
                                height={Math.abs(this.state.selectionStart.y - this.state.selectionEnd.y)}></rect>
                        </svg>
                    }
                    {
                        this.props.chips.map(chip => {
                            return <Chip isSelected={this.isInSelection(chip, top, bottom, left, right)} context={this.props.context} key={chip.id} chip={chip} onChipDelete={this.props.onChipDelete} onPinClicked={this.props.onPinClicked} redraw={this.props.redraw} ></Chip>
                        })
                    }
                    {
                        this.props.wires.map(wire => {
                            return <Wire context={this.props.context} key={`${wire.fromId}_${wire.toId}`} wire={wire} onWireDelete={this.props.onWireDelete} ></Wire>
                        })
                    }
                </div>
            </Draggable >
        );
    }
}

export default Board;
