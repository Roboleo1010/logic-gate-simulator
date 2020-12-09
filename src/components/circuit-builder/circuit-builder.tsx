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
import { Gate as SimulationGate, SimulationState, TriState } from '../../simulation/simulator.types';
import './circuit-builder.scss';
import 'react-notifications-component/dist/theme.css';

interface CircuitBuilderState {
    chipBlueprints: ChipBlueprint[];
    chips: ChipInstance[];
    wires: WireModel[];
    lastClickedPin?: Gate;
    simulationHandle?: any;
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
            newWires.push({ fromId: this.state.lastClickedPin.id, toId: gate.id, state: TriState.Floating });
        else
            newWires.push({ fromId: gate.id, toId: this.state.lastClickedPin.id, state: TriState.Floating });

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
                if (gate.role === GateRole.InputActive) { //TODO: Use switch
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

        let chipName = `Custom ${ChipManager.getChipId("Custom")}`;

        let blueprint = new ChipBlueprint(chipName, "#aaff33", "custom", graph)

        let newBlueprints = this.state.chipBlueprints;
        newBlueprints.push(blueprint);
        this.setState({ chipBlueprints: newBlueprints });

        NotificationManager.addNotification("Chip Packaged", `Chip ${chipName} added to category Chips (Custom).`, NotificationType.Success);
    }
    //#endregion

    setTool(tool: Tool) {
        let context = this.state.context;
        context.activeTool = tool;

        this.setState({ context: context, lastClickedPin: undefined });
        this.forceUpdate();
    }

    //#region Simulation
    startSimulation() {
        console.log('%cStarting Simulation', 'background-color:green');

        let context = this.state.context;
        context.isSimulationRunning = true;

        const handle = setInterval(() => { this.simulate() }, 500)

        this.setState({ context: context, simulationHandle: handle, lastClickedPin: undefined });

        NotificationManager.addNotification("Starting Simulation", ' ', NotificationType.Info);
    }

    simulate() {
        const result = new Simulation(this.getGates()).simulate();

        this.setPinState(result.states);
        this.setWireState(result.states);

        console.log(result);

        this.forceUpdate();
    }

    stopSimulation() {
        console.log('%cEnding Simulation', 'background-color:red');

        let context = this.state.context;
        context.isSimulationRunning = false;

        clearInterval(this.state.simulationHandle);

        this.setState({ context: context, simulationHandle: undefined, lastClickedPin: undefined });

        NotificationManager.addNotification("Stopping Simulation", ' ', NotificationType.Info);
    }

    //#region Simulation helpers

    getGates(): SimulationGate[] {
        let gates: SimulationGate[] = []
        let wires = [...this.state.wires];

        //get wires and gates
        this.state.chips.forEach(chip => {
            chip.graph.nodes.forEach(gate => {
                gates.push({ id: gate.id, state: gate.state, type: gate.type, inputs: [] });
            });
            chip.graph.edges.forEach(wire => {
                wires.push({ fromId: wire.from, toId: wire.to, state: TriState.Floating });
            });
        });

        gates.forEach(gate => {
            gate.inputs = wires.filter(wire => gate.id === wire.toId).map(wire => wire.fromId);
        });

        return gates;
    }

    setPinState(results: SimulationState[]) {
        this.state.chips.forEach(chip => {
            chip.graph.nodes.forEach(gate => {
                const result = results.find(res => res.id === gate.id);
                gate.state = result?.state!;
            });
        });
    }

    setWireState(results: SimulationState[]) {
        this.state.wires.forEach(wire => {
            const result = results.find(res => res.id === wire.fromId);
            wire.state = result?.state!;
        })
    }

    //#endregion
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
                            <ToolbarButtonToggle iconInactive={Icons.iconPlay} iconActive={Icons.iconPause} textInctive="Start Simulation" textActive="Stop Simulation" isActive={this.state.context.isSimulationRunning} onClick={this.state.context.isSimulationRunning ? this.stopSimulation.bind(this) : this.startSimulation.bind(this)}></ToolbarButtonToggle>
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