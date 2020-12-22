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

    selectedChips: ChipInstance[];
}

class Board extends Component<BoardProps, BoardState>{
    constructor(props: BoardProps) {
        super(props);

        this.state = { isSelecting: false, scale: 1, translation: { x: 0, y: 0 }, selectionStart: { x: 0, y: 0 }, selectionEnd: { x: 0, y: 0 }, selectedChips: [] };
    }

    onDragCallback(translation: Vector2) {
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

        const selectionEnd: Vector2 = { x: e.clientX - this.props.context.boardTranslation.x, y: e.clientY - this.props.context.boardTranslation.y };

        const top = Math.min(this.state.selectionStart.y, selectionEnd.y)
        const bottom = Math.max(this.state.selectionStart.y, selectionEnd.y)
        const left = Math.min(this.state.selectionStart.x, selectionEnd.x)
        const right = Math.max(this.state.selectionStart.x, selectionEnd.x)

        let selectedChips: ChipInstance[] = [];

        this.props.chips.forEach(chip => {
            if (this.isInSelection(chip, top, bottom, left, right))
                selectedChips.push(chip);
        });

        this.setState({ selectionEnd: selectionEnd, selectedChips: selectedChips });
    }

    onSelectionEnd(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (!this.state.isSelecting)
            return;

        this.setState({ isSelecting: false });
    }

    isInSelection(chip: ChipInstance, top: number, bottom: number, left: number, right: number): boolean {
        if (chip.startPosition.y + chip.size.y > top && chip.startPosition.y < bottom &&
            chip.startPosition.x + chip.size.x > left && chip.startPosition.x < right)
            return true;
        else
            return false;
    }
    //#endregion

    //#region render helper
    getSelectionBox(): JSX.Element {

        if (this.state.isSelecting)
            return (<svg className='selection-box'>
                <rect x={Math.min(this.state.selectionStart.x, this.state.selectionEnd.x)}
                    y={Math.min(this.state.selectionStart.y, this.state.selectionEnd.y)}
                    width={Math.abs(this.state.selectionStart.x - this.state.selectionEnd.x)}
                    height={Math.abs(this.state.selectionStart.y - this.state.selectionEnd.y)}></rect>
            </svg>);
        else
            return <></>;
    }
    //#endregion

    render() {
        return (
            <Draggable className="board-size" confine='fullscreen' classNameDragging="board-pan-active" classNameEnabled="board-pan-inactive" enabled={this.props.context.activeTool === Tool.Pan} onDrag={this.onDragCallback.bind(this)} >
                <div className="board board-size" onMouseDown={this.onSelectionStart.bind(this)} onMouseMove={this.onSelectionDrag.bind(this)} onMouseUp={this.onSelectionEnd.bind(this)} onContextMenuCapture={(e) => { this.setState({ selectionStart: { x: 0, y: 0 }, selectionEnd: { x: 0, y: 0 } }); e.preventDefault(); return false; }}>
                    {this.getSelectionBox()}
                    {this.props.wires.map(wire => { return (<Wire context={this.props.context} key={`${wire.fromId}_${wire.toId}`} wire={wire} onWireDelete={this.props.onWireDelete} ></Wire>) })}
                    {
                        this.props.chips.map(chip => {
                            return (
                                <Draggable confine='parent' className="absolute" enabled={this.props.context.activeTool === Tool.Move && !this.props.context.isSimulationRunning}>
                                    <Chip isSelected={this.state.selectedChips.includes(chip)} context={this.props.context} key={chip.id} chip={chip} onChipDelete={this.props.onChipDelete} onPinClicked={this.props.onPinClicked} ></Chip>
                                </Draggable>)
                        })
                    }
                </div>
            </Draggable >
        );
    }
}

export default Board;