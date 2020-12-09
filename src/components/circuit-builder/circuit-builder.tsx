import Board from '../board/board';
import ChipBlueprint from '../../model/chip-blueprint';
import ChipInstance from '../../model/chip-instance';
import ChipManager from '../../manager/chip-manager';
import Graph from '../../utilities/graph/graph';
import Icons from '../../assets/icons/icons';
import NotificationManager, { NotificationType } from '../../manager/notification-manager';
import React, { Component } from 'react';
import ReactNotification from 'react-notifications-component';
import Simulation from '../../simulation/simulation';
import Toolbar from '../toolbar/toolbar';
import ToolbarButton from '../toolbar/toolbar-button/toolbar-button';
import ToolbarButtonMulti from '../toolbar/toolbar-button-multi/toolbar-button-multi';
import ToolbarButtonToggle from '../toolbar/toolbar-button-toggle/toolbar-button-toggle';
import ToolbarGroup from '../toolbar/toolbar-group/toolbar-group';
import Toolbox from '../toolbox/toolbox';
import { CircuitBuilderContext, Gate, GateRole, SignalDirection, Tool, WireModel } from '../../model/circuit-builder.types';
import { Gate as SimulationGate } from '../../simulation/simulator.types';
import './circuit-builder.scss';
import 'react-notifications-component/dist/theme.css';

interface CircuitBuilderState {
    chipBlueprints: ChipBlueprint[];
    chips: ChipInstance[];
    wires: WireModel[];
    lastClickedPin?: Gate;
    context: CircuitBuilderContext;
}

class CircuitBuilder extends Component<{}, CircuitBuilderState> {
    constructor(props: any) {
        super(props);
        this.state = { chips: [], wires: [], chipBlueprints: ChipManager.getBlueprints(), context: { activeTool: Tool.Move, isSimulationRunning: false } };
    }

    //#region Chip & Wire Events
    addChipToBoard(blueprint: ChipBlueprint, position: { x: number, y: number } | undefined = undefined) {
        let newChips = this.state.chips;
        newChips.push(new ChipInstance(blueprint, position));
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
        if (this.state.lastClickedPin.signalDirection === gate.signalDirection) {
            NotificationManager.addNotification("Wire Error", `Can't connect to same the pintype. Both selected pins are ${gate.signalDirection?.toLowerCase()}s`, NotificationType.Warning);
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

        if (gate.signalDirection === SignalDirection.In)
            newWires.push({ fromId: this.state.lastClickedPin.id, toId: gate.id });
        else
            newWires.push({ fromId: gate.id, toId: this.state.lastClickedPin.id });

        this.setState({ wires: newWires, lastClickedPin: undefined })
    }

    removeWireFromBoard(wireToDelete: WireModel) {
        this.setState({ wires: this.state.wires.filter(wire => wire.fromId !== wireToDelete.fromId || wire.toId !== wireToDelete.toId) });
    }

    packageChip() {
        let graph: Graph<Gate> = new Graph<Gate>();

        //Build Graph
        this.state.chips.forEach(chip => {
            chip.graph.nodes.forEach(gate => {
                if (gate.role === GateRole.InputActive) {
                    let copy: Gate = { ...gate };
                    copy.role = GateRole.InputInactive;
                    graph.addNode(copy);
                }
                else
                    graph.addNode(gate);

            });
            graph.addEdges(chip.graph.edges);
        });

        this.state.wires.forEach(wire => {
            graph.addEdge({ from: wire.fromId, to: wire.toId });
        })

        let blueprint = new ChipBlueprint(`Custom ${ChipManager.getChipId("Custom")}`, "#aaff33", "custom", graph)

        let newBlueprints = this.state.chipBlueprints;
        newBlueprints.push(blueprint);
        this.setState({ chipBlueprints: newBlueprints });
    }
    //#endregion

    setTool(tool: Tool) {
        let context = this.state.context;
        context.activeTool = tool;

        this.setState({ context: context, lastClickedPin: undefined });
        this.forceUpdate();
    }

    simulate() {
        let gates: SimulationGate[] = []
        let wires = this.state.wires;

        //get wires and gates
        this.state.chips.forEach(chip => {
            chip.graph.nodes.forEach(gate => {
                gates.push({ id: gate.id, state: gate.state, type: gate.type, inputs: [] });
            });
            chip.graph.edges.forEach(wire => {
                wires.push({ fromId: wire.from, toId: wire.to });
            });
        });

        gates.forEach(gate => {
            gate.inputs = wires.filter(wire => gate.id === wire.toId).map(wire => wire.fromId);
        });

        console.log(new Simulation(gates).simulate());
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
                <Board context={this.state.context} chips={this.state.chips} wires={this.state.wires} redraw={() => this.forceUpdate()} onChipDelete={this.removeChipFromBoard.bind(this)} onPinClicked={this.addWireToBoard.bind(this)} onWireDelete={this.removeWireFromBoard.bind(this)} ></Board>
                <Toolbox blueprints={this.state.chipBlueprints} onChipClicked={(this.addChipToBoard.bind(this))}></Toolbox>
                <div className="toolbar-container">
                    <Toolbar>
                        <ToolbarGroup>
                            <ToolbarButtonMulti icon={Icons.iconMove} text="Move" onClick={() => this.setTool(Tool.Move)} isActive={this.state.context.activeTool === Tool.Move}></ToolbarButtonMulti>
                            <ToolbarButtonMulti icon={Icons.iconDelete} text="Delete" onClick={() => this.setTool(Tool.Delete)} isActive={this.state.context.activeTool === Tool.Delete}></ToolbarButtonMulti>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarButtonToggle iconInactive={Icons.iconPlay} iconActive={Icons.iconPause} textInctive="Start Simulation" textActive="Stop Simulation" isActive={this.state.context.isSimulationRunning} onClick={this.simulate.bind(this)}></ToolbarButtonToggle>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarButton icon={Icons.iconChip} text="Package Chip" onClick={this.packageChip.bind(this)}></ToolbarButton>
                        </ToolbarGroup>
                    </Toolbar>
                </div>
            </div >
        );
    }
}

export default CircuitBuilder;