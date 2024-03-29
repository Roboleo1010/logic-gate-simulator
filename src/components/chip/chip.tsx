import ChipInstance from '../../model/chip-instance';
import GateHelper from '../../utilities/GateHelper';
import NotificationManager, { NotificationType } from '../../manager/notification-manager';
import React, { Component } from 'react';
import { CircuitBuilderContext, Gate, PinSide, Tool } from '../../model/circuit-builder.types';
import './chip.scss';

interface ChipProps {
    chip: ChipInstance;
    context: CircuitBuilderContext;
    isSelected: boolean,

    onChipDelete: (chip: ChipInstance) => void;
    onPinClicked: (gate: Gate) => void;
    redraw: () => void;

    extraClassName?: string;
    extraClickEvent?: () => void;
}

interface ChipState {
    growableIndex: number;
}

class Chip extends Component<ChipProps, ChipState> {
    constructor(props: ChipProps) {
        super(props);

        let startIndex = this.props.chip.blueprint.growableData ? this.props.chip.blueprint.growableData.startIndex : 0;
        this.state = { growableIndex: startIndex };
    }

    private chipRef: React.RefObject<HTMLDivElement> = React.createRef();

    componentDidMount() {
        if (this.chipRef.current) {
            const rect = this.chipRef.current!.getBoundingClientRect();
            this.props.chip.size = { x: rect.width, y: rect.height };
        }
    }

    renamePin(gate: Gate) {
        let name = window.prompt("Pin name:", gate.name);

        if (!name || name === '')
            return;

        gate.name = name;
        this.forceUpdate();
    }

    getPinElementsForSide(side: PinSide): JSX.Element {
        return (
            <div className={`pin-side pins-${side.toLowerCase()}`}>
                {GateHelper.getGatesForPinSide(this.props.chip.graph, side).map((gate) => {
                    let className = "pin ";

                    if (gate.error === true)
                        className += "pin-error ";

                    if (this.props.context.isSimulationRunning) {
                        if (gate.state === true)
                            className += 'pin-true ';
                        else
                            className += 'pin-false ';
                    }

                    let clickEvent = () => { };

                    if (this.props.context.activeTool === Tool.Wire)
                        clickEvent = () => this.props.onPinClicked(gate);
                    else if (this.props.context.activeTool === Tool.Rename) {
                        clickEvent = () => this.renamePin(gate);
                        className += "pin-tool-rename ";
                    }

                    return (<div data-gateid={gate.id} key={gate.id} className={className} title={gate.name} onClick={clickEvent} onTouchStart={() => { if (gate.name) NotificationManager.addNotification(gate.name, " ", NotificationType.Default, 2000) }}></div>);
                })}
            </div>
        );
    }

    render() {
        const minYSize = Math.max(GateHelper.getGatesForPinSide(this.props.chip.graph, PinSide.Left).length, GateHelper.getGatesForPinSide(this.props.chip.graph, PinSide.Right).length) * 20;
        const minXSize = Math.max(GateHelper.getGatesForPinSide(this.props.chip.graph, PinSide.Top).length, GateHelper.getGatesForPinSide(this.props.chip.graph, PinSide.Bottom).length) * 20;

        const style = {
            backgroundColor: this.props.chip.blueprint.color,
            minWidth: minXSize >= 100 ? minXSize : 100,
            minHeight: minYSize >= 50 ? minYSize : 50,
        };

        let className = 'chip chip-on-board ' + this.props.extraClassName + ' ';
        let clickEvent = this.props.extraClickEvent;

        if (!this.props.context.isSimulationRunning) {
            if (this.props.context.activeTool === Tool.Delete) {
                className += 'chip-tool-delete ';
                clickEvent = () => { this.props.onChipDelete(this.props.chip) };
            }
            else if (this.props.context.activeTool === Tool.Move)
                className += 'chip-tool-move ';

            if (this.props.isSelected)
                className += 'selected ';
        }

        return (
            <div ref={this.chipRef} data-chipid={this.props.chip.id} className={className} style={style} onClick={clickEvent}>
                <span>{this.props.chip.blueprint.name}</span>
                <></>
                {this.props.children}
                {this.getPinElementsForSide(PinSide.Top)}
                {this.getPinElementsForSide(PinSide.Left)}
                {this.getPinElementsForSide(PinSide.Bottom)}
                {this.getPinElementsForSide(PinSide.Right)}
            </div>
        );
    }
}

export default Chip;