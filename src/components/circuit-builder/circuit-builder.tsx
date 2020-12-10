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
import { Gate as SimulationGate, GateType, SimulationState, TriState } from '../../simulation/simulator.types';
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

        //2 wires on input Pin
        if ((this.state.wires.filter(wire => wire.toId === gate.id)).length > 0) {
            NotificationManager.addNotification("Wire Error", "Can't connect two wires to same input pin.", NotificationType.Warning);
            this.setState({ lastClickedPin: undefined });
            return;
        }

        //2 wires on output pin
        if ((this.state.wires.filter(wire => wire.fromId === gate.id)).length > 0) {
            NotificationManager.addNotification("Wire Error", "Can't connect two wires to same output pin.", NotificationType.Warning);
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
        //Check for validity
        if (this.checkValidity().length > 0) {
            NotificationManager.addNotification("Pin Error", "Please connect all unconnected inputs.", NotificationType.Error);
            return;
        }
        if (this.getGatesByRole(GateRole.Switch).length === 0) {
            NotificationManager.addNotification("Package Error", "A Chip should include at least one Input", NotificationType.Error);
            return;
        }
        if (this.getGatesByRole(GateRole.Output).length === 0) {
            NotificationManager.addNotification("Package Error", "A Chip should include at least one Output", NotificationType.Error);
            return;
        }

        //Build Graph
        let allGates: Gate[] = [];
        let allWires: WireModel[] = [...this.state.wires];

        this.state.chips.forEach(chip => {
            chip.graph.nodes.forEach(gate => {
                allGates.push({ ...gate });
            });

            chip.graph.edges.forEach(edge => {
                allWires.push({ fromId: edge.from, toId: edge.to, state: TriState.Floating });
            });
        });

        let graph: Graph<Gate> = new Graph<Gate>();

        allGates.forEach(gate => {
            //Show switch inputs
            if (gate.role === GateRole.Switch && gate.type === GateType.Controlled) {
                gate.type = GateType.Relay;
                gate.signalDirection = SignalDirection.In;
            }
            //Show output outputs
            else if (gate.role === GateRole.Output) {
                gate.signalDirection = SignalDirection.Out;
            }
            //hide all unused outputs
            else if (allWires.filter(wire => wire.fromId === gate.id).length === 0)
                gate.hidden = true;
        });

        graph.addNodes(allGates);

        allWires.forEach(wire => {
            graph.addEdge({ from: wire.fromId, to: wire.toId });
        })

        //Build Blueprint
        let name = window.prompt("Please enter a name for your chip:");

        if (!name)
            name = `Custom-${ChipManager.getChipId("Custom")}`;

        const blueprint = new ChipBlueprint(name, "#aaff33", "custom", graph)

        console.log(blueprint);

        //Add to Manager
        let newBlueprints = this.state.chipBlueprints;
        newBlueprints.push(blueprint);
        this.setState({ chipBlueprints: newBlueprints });

        NotificationManager.addNotification("Chip Packaged", `Chip ${name} added to category Chips (Custom).`, NotificationType.Success);
    }
    //#endregion

    setTool(tool: Tool) {
        let context = this.state.context;
        context.activeTool = tool;

        this.setState({ context: context, lastClickedPin: undefined });
    }

    //#region Simulation
    startSimulation() {
        console.log('%cStarting Simulation', 'background-color:green');

        let missingInputs = this.checkValidity();

        if (missingInputs.length > 0) {
            NotificationManager.addNotification("Pin Error", "Please connect all unconnected inputs.", NotificationType.Error);
            return;
        }

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

    checkValidity(highlight: boolean = true): Gate[] {
        let allGates: Gate[] = [];
        let allWires: WireModel[] = [...this.state.wires];
        let missingInputs: Gate[] = [];

        this.state.chips.forEach(chip => {
            allGates.push(...chip.graph.nodes);
            chip.graph.edges.forEach(edge => {
                allWires.push({ fromId: edge.from, toId: edge.to, state: TriState.Floating });
            });
        });

        allGates.forEach(gate => {
            if (gate.type !== GateType.Controlled && allWires.filter(wire => wire.toId === gate.id).length === 0)
                missingInputs.push(gate);
        })

        if (highlight && missingInputs.length > 0) {
            this.resetPinError();
            this.setPinError(missingInputs);
            this.forceUpdate();
        }

        return missingInputs;
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
        });
    }

    resetPinError() {
        this.state.chips.forEach(chip => {
            chip.graph.nodes.forEach(gate => {
                gate.error = undefined;
            });
        });
    }

    setPinError(missingConnections: Gate[]) {
        missingConnections.forEach(gate => {
            this.getGateById(gate.id)!.error = true;
        });
    }

    //#endregion
    //#endregion

    //#region Helpers

    getGateById(id: string): Gate | undefined {
        let result = undefined;

        this.state.chips.forEach(chip => {
            let gate = chip.graph.nodes.find(gate => gate.id === id);

            if (gate)
                result = gate;
        });

        return result;
    }

    getGatesByType(type: GateType): Gate[] {
        let result: Gate[] = [];

        this.state.chips.forEach(chip => {
            result.push(...chip.graph.nodes.filter(gate => gate.type === type));
        });

        return result;
    }

    getGatesByRole(role: GateRole): Gate[] {
        let result: Gate[] = [];

        this.state.chips.forEach(chip => {
            result.push(...chip.graph.nodes.filter(gate => gate.role === role));
        });

        return result;
    }

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
                            <ToolbarButtonMulti icon={Icons.iconRename} text="Rename" onClick={() => this.setTool(Tool.Rename)} isActive={this.state.context.activeTool === Tool.Rename}></ToolbarButtonMulti>
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