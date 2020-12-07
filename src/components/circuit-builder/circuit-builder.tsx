import Board from '../board/board';
import ChipBlueprint from '../../model/chip-blueprint';
import ChipInstance from '../../model/chip-instance';
import ChipManager from '../../manager/chip-manager';
import CircuitBuilderContext from '../context/circuit-builder-context/circuit-builder-context';
import Icons from '../../assets/icons/icons';
import NotificationManager, { NotificationType } from '../../manager/notification-manager';
import React, { Component } from 'react';
import ReactNotification from 'react-notifications-component';
import Toolbar from '../toolbar/toolbar';
import ToolbarButton from '../toolbar/toolbar-button/toolbar-button';
import ToolbarButtonMulti from '../toolbar/toolbar-button-multi/toolbar-button-multi';
import ToolbarButtonToggle from '../toolbar/toolbar-button-toggle/toolbar-button-toggle';
import ToolbarGroup from '../toolbar/toolbar-group/toolbar-group';
import Toolbox from '../toolbox/toolbox';
import { Gate, GateRole, Tool, WireModel } from '../../model/circuit-builder.types';
import './circuit-builder.scss';
import 'react-notifications-component/dist/theme.css';

interface CircuitBuilderState {
    chipBlueprints: ChipBlueprint[];
    chips: ChipInstance[];
    wires: WireModel[];
    lastClickedPin?: Gate;
}

class CircuitBuilder extends Component<{}, CircuitBuilderState> {
    static contextType = CircuitBuilderContext;

    constructor(props: any) {
        super(props);
        this.state = { chips: [], wires: [], chipBlueprints: ChipManager.getBlueprints() };
    }

    //#region Add & Remove from Board
    addChipToBoard(blueprint: ChipBlueprint) {
        let newChips = this.state.chips;
        newChips.push(new ChipInstance(blueprint));
        this.setState({ chips: newChips })
    }

    removeChipFromBoard(chipToDelete: ChipInstance) {
        let gateIds = chipToDelete.graph.nodes.map(gate => gate.id);

        this.setState({
            chips: this.state.chips.filter(chip => chip.id !== chipToDelete.id),
            wires: this.state.wires.filter(wire => !gateIds.includes(wire.fromId) && !gateIds.includes(wire.toId))
        });
    }

    addWireToBoard(gate: Gate) {
        if (!this.state.lastClickedPin) {
            this.setState({ lastClickedPin: gate });
            return;
        }

        //sanity Checks

        //Same Pin
        if (this.state.lastClickedPin.id === gate.id) {
            NotificationManager.addNotification("Wire Error", "Can't connect to the same pin.", NotificationType.Warning);
            this.setState({ lastClickedPin: undefined });
            return;
        }

        //input -> input || output -> output
        if (this.state.lastClickedPin.role === gate.role) {
            NotificationManager.addNotification("Wire Error", `Can't connect to same the pintype. Both selected pins are ${gate.role?.toLowerCase()}s`, NotificationType.Warning);
            this.setState({ lastClickedPin: undefined });
            return;
        }

        //2 wires on Pin
        if ((this.state.wires.filter(wire => wire.toId === gate.id)).length > 0) {
            NotificationManager.addNotification("Wire Error", "Can't connect two wires to same input pin.", NotificationType.Warning);
            this.setState({ lastClickedPin: undefined });
            return;
        }

        let newWires = this.state.wires;

        if (gate.role === GateRole.Input)
            newWires.push({ fromId: this.state.lastClickedPin.id, toId: gate.id });
        else
            newWires.push({ fromId: gate.id, toId: this.state.lastClickedPin.id });

        this.setState({ wires: newWires, lastClickedPin: undefined })
    }

    removeWireFromBoard(wireToDelete: WireModel) {
        this.setState({ wires: this.state.wires.filter(wire => wire.fromId !== wireToDelete.fromId || wire.toId !== wireToDelete.toId) });
    }
    //#endregion

    setTool(tool: Tool) {
        this.context.activeTool = tool;
        this.setState({ lastClickedPin: undefined });
        this.forceUpdate();
    }

    //TODO: Reintegrate Simulation
    //#region Simulation
    // startSimulation() {
    //     this.resetChipState();
    //     this.resetChipError();
    //     this.resetWireState();

    //     const gates: Gate[] = this.getGates();
    //     const clocks: Gate[] = gates.filter(gate => gate.function === GateFunction.Clock);

    //     this.simulation = new Simulation(gates);

    //     const handle = setInterval(() => { this.simulate() }, 500)

    //     this.setState({ simulationHandle: handle, clockChips: clocks });
    //     this.context.isSimulationRunning = true;

    //     NotificationManager.addNotification("Starting Simulation", ' ', NotificationType.Info);
    // }

    // getGates(): Gate[] {
    //     let gates: Gate[] = [];

    //     this.state.chips.forEach(chip => {
    //         chip.gates.forEach(gate => {
    //             gates.push(gate);
    //         });
    //     });

    //     this.state.wires.forEach(wire => {
    //         gates.filter(gate => gate.id === wire.outputId)[0].inputs = [wire.inputId]
    //     });

    //     return gates;
    // }

    // simulate() {
    //     console.log("Simulation Tick");

    //     //Setting Clock State
    //     this.state.clockChips.filter(gate => gate.function === GateFunction.Clock).forEach(clock => this.simulation?.changeGateState(clock.id, clock.state === TriState.True ? clock.state = TriState.False : clock.state = TriState.True));

    //     const result = this.simulation?.simulate()!;

    //     if (result.error) {
    //         console.error(result);

    //         if (result.missingConnections.length > 0) {
    //             this.setChipError(result.missingConnections);
    //             NotificationManager.addNotification("Connections missing", 'Wire all marked pins.', NotificationType.Warning);
    //         }
    //         else
    //             NotificationManager.addNotification("Simulation Error", `An unknown error occured during the simulation. Please try again.`, NotificationType.Error);

    //         this.stopSimulation();
    //     }
    //     else {
    //         this.setpinState(result.states);
    //         this.setWireState(result.states);
    //     }

    //     this.forceUpdate();
    // }

    // stopSimulation() {
    //     if (!this.context.isSimulationRunning)
    //         return;

    //     NotificationManager.addNotification("Stopping Simulation", ' ', NotificationType.Info);
    //     clearInterval(this.state.simulationHandle);
    //     this.setState({ simulationHandle: undefined });
    //     this.context.isSimulationRunning = false;
    //     this.simulation = undefined;

    //     this.resetChipState();
    //     this.resetWireState();
    // }
    // //#endregion

    // //#region Setting pin/ Wire State/ Error
    // setpinState(results: SimulationState[]) {
    //     this.state.chips.forEach(chip => {
    //         chip.pins.forEach(pinSide => {
    //             pinSide.forEach(pin => {
    //                 const result = results.find(res => res.id === pin.id);
    //                 pin.gate.state = result?.state!;
    //             });
    //         });
    //     });
    // }

    // setWireState(results: SimulationState[]) {
    //     this.state.wires.forEach(wire => {
    //         const result = results.find(res => res.id === wire.inputId);
    //         wire.state = result?.state;
    //     })
    // }

    // setChipError(errors: string[]) {
    //     this.state.chips.forEach(chip => {
    //         chip.pins.forEach(pinSide => {
    //             pinSide.forEach(pin => {
    //                 if (errors.find(error => error === pin.id))
    //                     pin.error = true;
    //             });
    //         });
    //     });
    // }

    // resetChipState() {
    //     this.state.chips.forEach(chip => {
    //         chip.pins.forEach(pinSide => {
    //             pinSide.forEach(pin => {
    //                 pin.gate.state = TriState.Floating;
    //             });
    //         });
    //     });
    // }

    // resetWireState() {
    //     this.state.wires.forEach(wire => {
    //         wire.state = TriState.Floating;
    //     })
    // }

    // resetChipError() {
    //     this.state.chips.forEach(chip => {
    //         chip.pins.forEach(pinSide => {
    //             pinSide.forEach(pin => {
    //                 pin.error = false;
    //             });
    //         });
    //     });
    // }
    //#endregion

    render() {
        return (
            <div className="circuit-builder" >
                <ReactNotification />
                <Board chips={this.state.chips} wires={this.state.wires} redraw={() => this.forceUpdate()} onChipDelete={this.removeChipFromBoard.bind(this)} onPinClicked={this.addWireToBoard.bind(this)} onWireDelete={this.removeWireFromBoard.bind(this)} ></Board>
                <Toolbox blueprints={this.state.chipBlueprints} onChipClicked={(this.addChipToBoard.bind(this))}></Toolbox>
                <div className="toolbar-container">
                    <Toolbar>
                        <ToolbarGroup>
                            <ToolbarButtonMulti icon={Icons.iconMove} text="Move" onClick={() => this.setTool(Tool.Move)} isActive={this.context.activeTool === Tool.Move}></ToolbarButtonMulti>
                            <ToolbarButtonMulti icon={Icons.iconDelete} text="Delete" onClick={() => this.setTool(Tool.Delete)} isActive={this.context.activeTool === Tool.Delete}></ToolbarButtonMulti>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarButtonToggle iconInactive={Icons.iconPlay} iconActive={Icons.iconPause} textInctive="Start Simulation" textActive="Stop Simulation" isActive={this.context.isSimulationRunning} onClick={() => { }}></ToolbarButtonToggle>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarButton icon={Icons.iconChip} text="Package Chip" onClick={() => { }}></ToolbarButton>
                        </ToolbarGroup>
                    </Toolbar>
                </div>
            </div >
        );
    }
}

export default CircuitBuilder;