import ChipInstance from '../../model/chip-instance';
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

    extraClassName?: string;
    extraClickEvent?: () => void;
}

class Chip extends Component<ChipProps> {
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

    getGatesForPinSide(side: PinSide) {
        return this.props.chip.graph.nodes.filter(gate => gate.pinSide === side && !(gate.hidden === true) && (this.props.chip.graph.edges.filter(wire => gate.id === wire.to).length === 0 || this.props.chip.graph.edges.filter(wire => gate.id === wire.from).length === 0)); // later part for only getting exposed pins
    }

    getPinElementsForSide(side: PinSide): JSX.Element {
        return (
            <div className={`pin-side pins-${side.toLowerCase()}`}>
                {this.getGatesForPinSide(side).map((gate) => {
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
        const minYSize = Math.max(this.getGatesForPinSide(PinSide.Left).length, this.getGatesForPinSide(PinSide.Right).length) * 20;
        const minXSize = Math.max(this.getGatesForPinSide(PinSide.Top).length, this.getGatesForPinSide(PinSide.Bottom).length) * 20;

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