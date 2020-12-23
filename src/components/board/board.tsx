import Chip from '../chip/chip';
import ChipBinaryDisplay from '../chip/chip-binary-display/chip-binary-display';
import ChipBinaryInput from '../chip/chip-binary-input/chip-binary-input';
import ChipInstance from '../../model/chip-instance';
import ChipOutput from '../chip/chip-output/chip-output';
import ChipSwitch from '../chip/chip-switch/chip-switch';
import Draggable from '../draggable/draggable';
import EventHandlerHelper from '../../utilities/EventHandlerHelper';
import React, { Component } from 'react';
import Wire from '../wire/wire';
import { ChipRole, CircuitBuilderContext, Gate, Tool, Vector2, WireModel } from '../../model/circuit-builder.types';
import './board.scss';

interface BoardProps {
    chips: ChipInstance[];
    wires: WireModel[];
    context: CircuitBuilderContext;

    onPinClicked: (gate: Gate) => void;
    onChipDelete: (chip: ChipInstance) => void;
    onWireDelete: (id: WireModel) => void;

    redraw: () => void;
}

interface BoardState {
    translation: Vector2;

    isSelecting: boolean;
    selectionStart: Vector2;
    selectionEnd: Vector2;

    selectedChips: ChipInstance[];
    selectedDragChipId?: string;
    selectedDragDelta?: Vector2;

    borardRef: React.RefObject<HTMLDivElement>;
}

class Board extends Component<BoardProps, BoardState>{
    constructor(props: BoardProps) {
        super(props);

        this.state = { isSelecting: false, translation: { x: 0, y: 0 }, selectionStart: { x: 0, y: 0 }, selectionEnd: { x: 0, y: 0 }, selectedChips: [], borardRef: React.createRef() };
    }

    //#region add/ remove EventListener
    componentDidMount() {
        if (this.state.borardRef.current) {
            this.state.borardRef.current.addEventListener('touchstart', this.onSelectionStart.bind(this), { passive: false });
            this.state.borardRef.current.addEventListener('touchmove', this.onSelectionDrag.bind(this), { passive: false });
            this.state.borardRef.current.addEventListener('touchend', this.onSelectionEnd.bind(this), { passive: false });
        }
        else
            console.error("board ref is undefined");
    }

    componentWillUnmount() {
        if (this.state.borardRef.current) {
            this.state.borardRef.current.removeEventListener('touchstart', this.onSelectionStart.bind(this),);
            this.state.borardRef.current.removeEventListener('touchmove', this.onSelectionDrag.bind(this));
            this.state.borardRef.current.removeEventListener('touchend', this.onSelectionEnd.bind(this));
        }
        else
            console.error("board ref is undefined");
    }
    //#endregion

    onDragCallback(translation: Vector2) {
        this.setState({ translation: translation });
        this.props.context.boardTranslation = translation;
    }

    //#region Selection box
    onSelectionStart(e: any) {
        if (this.props.context.activeTool === Tool.Select) {
            const clientPos = EventHandlerHelper.GetEventClientPos(e, "touchstart");

            const startPos: Vector2 = { x: clientPos.x - this.props.context.boardTranslation.x, y: clientPos.y - this.props.context.boardTranslation.y }
            this.setState({ selectionStart: startPos, selectionEnd: startPos, isSelecting: true });
        }
    }

    onSelectionDrag(e: any) {
        if (!this.state.isSelecting)
            return;

        const clientPos = EventHandlerHelper.GetEventClientPos(e, "touchmove");
        const selectionEnd: Vector2 = { x: clientPos.x - this.props.context.boardTranslation.x, y: clientPos.y - this.props.context.boardTranslation.y };

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

    onSelectionEnd(e: any) {
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

    getDetla(position: Vector2, translation: Vector2): Vector2 {
        return { x: translation.x - position.x, y: translation.y - position.y };
    }

    getChipComponent(chip: ChipInstance, isSelected: boolean): JSX.Element {
        if (chip.blueprint.role === ChipRole.BinaryDisplay)
            return <ChipBinaryDisplay isSelected={isSelected} context={this.props.context} key={chip.id} chip={chip} onChipDelete={this.props.onChipDelete} onPinClicked={this.props.onPinClicked} redraw={this.props.redraw}></ChipBinaryDisplay>;
        else if (chip.blueprint.role === ChipRole.BinaryInput)
            return <ChipBinaryInput isSelected={isSelected} context={this.props.context} key={chip.id} chip={chip} onChipDelete={this.props.onChipDelete} onPinClicked={this.props.onPinClicked} redraw={this.props.redraw}></ChipBinaryInput>;
        if (chip.blueprint.role === ChipRole.Switch)
            return <ChipSwitch isSelected={isSelected} context={this.props.context} key={chip.id} chip={chip} onChipDelete={this.props.onChipDelete} onPinClicked={this.props.onPinClicked} redraw={this.props.redraw}></ChipSwitch>;
        else if (chip.blueprint.role === ChipRole.Output)
            return <ChipOutput isSelected={isSelected} context={this.props.context} key={chip.id} chip={chip} onChipDelete={this.props.onChipDelete} onPinClicked={this.props.onPinClicked} redraw={this.props.redraw}></ChipOutput>;

        return <Chip isSelected={isSelected} context={this.props.context} key={chip.id} chip={chip} onChipDelete={this.props.onChipDelete} onPinClicked={this.props.onPinClicked} redraw={this.props.redraw}></Chip>;
    }


    render() {
        let className = "board board-size ";

        if (this.props.context.activeTool === Tool.Pan)
            className += "board-tool-pan "




        return (
            <Draggable className="board-size" confine='fullscreen' enabled={this.props.context.activeTool === Tool.Pan} onDragCallback={this.onDragCallback.bind(this)}>
                <div ref={this.state.borardRef} className={className} onMouseDown={this.onSelectionStart.bind(this)} onMouseMove={this.onSelectionDrag.bind(this)} onMouseUp={this.onSelectionEnd.bind(this)} onContextMenuCapture={(e) => { this.setState({ selectionStart: { x: 0, y: 0 }, selectionEnd: { x: 0, y: 0 }, selectedChips: [] }); e.preventDefault(); return false; }}>
                    {this.getSelectionBox()}
                    {this.props.wires.map(wire => { return (<Wire context={this.props.context} key={`${wire.fromId}_${wire.toId}`} wire={wire} onWireDelete={this.props.onWireDelete} ></Wire>) })}
                    {
                        this.props.chips.map(chip => {
                            const isSelected = this.state.selectedChips.includes(chip);
                            let delta = undefined;

                            if (isSelected && this.state.selectedDragChipId !== chip.id)
                                delta = this.state.selectedDragDelta;

                            return (
                                <Draggable key={chip.id} confine='parent' delta={delta} className="absolute" enabled={this.props.context.activeTool === Tool.Move && !this.props.context.isSimulationRunning} startPosition={chip.position} onDragCallback={(translation) => { this.setState({ selectedDragDelta: this.getDetla(chip.position, translation), selectedDragChipId: chip.id }); chip.position = translation }} onDragEnd={() => this.setState({ selectedDragDelta: undefined, selectedDragChipId: undefined })}>
                                    {this.getChipComponent(chip, isSelected)}
                                </Draggable>)
                        })
                    }
                </div>
            </Draggable >
        );
    }
}

export default Board;