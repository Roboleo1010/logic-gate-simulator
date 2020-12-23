import Board from '../board/board';
import ChipInstance from '../../model/chip-instance';
import ChipManager from '../../manager/chip-manager';
import Constants from '../../constants';
import Graph from '../../utilities/graph/graph';
import Icons from '../../assets/icons/icons';
import LoadSaveModal from '../modal/modals/load-save-modal/load-save-modal';
import NotificationManager, { NotificationType } from '../../manager/notification-manager';
import PackageChipModal from '../modal/modals/package-chip-modal/package-chip-modal';
import React, { Component } from 'react';
import ReactNotification from 'react-notifications-component';
import Simulation from '../../simulation/simulation';
import Toolbar from '../toolbar/toolbar';
import ToolbarButton from '../toolbar/toolbar-button/toolbar-button';
import ToolbarButtonMulti from '../toolbar/toolbar-button-multi/toolbar-button-multi';
import ToolbarButtonToggle from '../toolbar/toolbar-button-toggle/toolbar-button-toggle';
import ToolbarGroup from '../toolbar/toolbar-group/toolbar-group';
import Toolbox from '../toolbox/toolbox';
import WelcomeMoal from '../modal/modals/welcome-modal/welcome-modal';
import { BlueprintSaveData, BlueprintType, ChipBlueprint, ChipCategory, CircuitBuilderContext, Gate, GateRole, PinSide, SignalDirection, Tool, Vector2, WireModel } from '../../model/circuit-builder.types';
import { Gate as SimulationGate, GateType, SimulationState } from '../../simulation/simulator.types';
import './circuit-builder.scss';
import 'react-notifications-component/dist/theme.css';

interface ChipBuilderProps {
    onSwitchTheme: () => void;
}

interface CircuitBuilderState {
    chipBlueprints: ChipBlueprint[];
    chips: ChipInstance[];
    wires: WireModel[];
    lastClickedPin?: Gate;
    simulationHandle?: any;
    context: CircuitBuilderContext;
    showPackageChipModal: boolean;
    showSaveLoadModal: boolean
    showWelcomeModal: boolean;
}

class CircuitBuilder extends Component<ChipBuilderProps, CircuitBuilderState> {
    constructor(props: any) {
        let showWelcomeModal = true;

        if (localStorage.getItem(Constants.ShowWelcomeModalKey) && localStorage.getItem(Constants.ShowWelcomeModalKey)! === "false")
            showWelcomeModal = false;

        super(props);
        this.state = {
            chips: [],
            wires: [],
            chipBlueprints: ChipManager.getBlueprints(),
            context: { activeTool: Tool.Move, isSimulationRunning: false, boardTranslation: { x: 0, y: 0 } },
            showPackageChipModal: false,
            showSaveLoadModal: false,
            showWelcomeModal: showWelcomeModal
        };
    }

    //#region Chip & Wire Events
    addChipToBoard(blueprint: ChipBlueprint, position: Vector2) {
        let newChips = this.state.chips;
        newChips.push(new ChipInstance(blueprint, { x: position.x - this.state.context.boardTranslation.x, y: position.y - this.state.context.boardTranslation.y }));
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
            newWires.push({ fromId: this.state.lastClickedPin.id, toId: gate.id, state: false });
        else
            newWires.push({ fromId: gate.id, toId: this.state.lastClickedPin.id, state: false });

        this.setState({ wires: newWires, lastClickedPin: undefined })
    }

    removeWireFromBoard(wireToDelete: WireModel) {
        this.setState({ wires: this.state.wires.filter(wire => wire.fromId !== wireToDelete.fromId || wire.toId !== wireToDelete.toId) });
    }

    setTool(tool: Tool) {
        let context = this.state.context;
        context.activeTool = tool;

        this.setState({ context: context, lastClickedPin: undefined });
    }

    //#endregion

    //#region Chip Packaging
    onPackageChip() {
        //Check for validity
        if (this.checkValidity().length > 0) {
            NotificationManager.addNotification("Some inputs are not connected", "Unconnected inputs have to be connected if you want to package this Chip.", NotificationType.Error, 5000);
            return;
        }
        //check Inputs
        if (this.getGatesByRole(GateRole.Switch, true).length === 0 && this.getGatesByRole(GateRole.Clock, true).length === 0) {
            NotificationManager.addNotification("Package Error", "A Chip should include at least one Input (Switch or Clock)", NotificationType.Error);
            return;
        }
        //Check Outputs
        if (this.getGatesByRole(GateRole.Output, true).length === 0) {
            NotificationManager.addNotification("Package Error", "A Chip should include at least one Output", NotificationType.Error);
            return;
        }

        this.setState({ showPackageChipModal: true });
    }

    getBlueprintGraph(): Graph<Gate> {
        //Build Graph
        let allGates: Gate[] = [];
        let allWires: WireModel[] = [...this.state.wires];

        this.state.chips.forEach(chip => {
            chip.graph.nodes.forEach(gate => {
                allGates.push({ ...gate });
            });

            chip.graph.edges.forEach(edge => {
                allWires.push({ fromId: edge.from, toId: edge.to, state: false });
            });
        });

        let graph: Graph<Gate> = new Graph<Gate>();

        allGates.forEach(gate => {
            //Show switches
            if (gate.role === GateRole.Switch && gate.type === GateType.Controlled) {
                gate.type = GateType.Relay;
                gate.signalDirection = SignalDirection.In;
                gate.pinSide = PinSide.Left;
            }
            //Show clocks
            else if (gate.role === GateRole.Clock && gate.type === GateType.Controlled) {
                gate.type = GateType.Relay;
                gate.signalDirection = SignalDirection.In;
                gate.pinSide = PinSide.Left;
            }
            //Show output outputs
            else if (gate.role === GateRole.Output) {
                gate.signalDirection = SignalDirection.Out;
                gate.pinSide = PinSide.Right;
            }
            //hide all unused outputs
            else if (allWires.filter(wire => wire.fromId === gate.id).length === 0)
                gate.hidden = true;

            gate.firstLayer = false;
        });

        graph.addNodes(allGates);

        allWires.forEach(wire => {
            graph.addEdge({ from: wire.fromId, to: wire.toId });
        });

        return graph;
    }

    packageChip(name: string, color: string, category: ChipCategory, graph: Graph<Gate>, description?: string) {

        //Build Blueprint
        const blueprint: ChipBlueprint = { name: name, color: color, category: category, graph: graph, description: description, type: BlueprintType.Custom };

        //Add to Manager
        let newBlueprints = this.state.chipBlueprints;
        newBlueprints.push(blueprint);
        this.setState({ chipBlueprints: newBlueprints });

        NotificationManager.addNotification("Chip Packaged", `Added ${name} to ${category}`, NotificationType.Success);

        localStorage.setItem(Constants.BlueprintSaveKey, this.getBlueprintSaveJSON());
    }

    //#endregion

    //#region Loading/ Saving
    getBlueprintSaveJSON(): string {
        return JSON.stringify({ version: Constants.SaveVersion, blueprints: this.state.chipBlueprints.filter(blueprint => blueprint.type === BlueprintType.Custom) });
    }

    loadBlueprints(blueprintData: string) {
        if (blueprintData === undefined || blueprintData === "") {
            NotificationManager.addNotification("Loading Error", "No savedata input.", NotificationType.Error);
            return;
        }

        try {
            let blueprintSaveData: BlueprintSaveData = JSON.parse(blueprintData!);

            if (blueprintSaveData.version !== Constants.SaveVersion) {
                NotificationManager.addNotification("Loading Error", "This software has been updated and your savedata is not longer supported.", NotificationType.Error);
                return;
            }

            let newBlueprints = this.state.chipBlueprints;
            newBlueprints.push(...blueprintSaveData.blueprints);
            this.setState({ chipBlueprints: newBlueprints });

            NotificationManager.addNotification("Loading successfull", " ", NotificationType.Success);
        }
        catch {
            NotificationManager.addNotification("Loading Error", "Your Savedata is invalid. Please check that you've copied the entire savedata.", NotificationType.Error);
        }
    }

    //#endregion

    //#region Simulation
    startSimulation() {
        console.log('%cStarting Simulation', 'background-color:green');

        let missingInputs = this.checkValidity(false);

        if (missingInputs.length > 0)
            NotificationManager.addNotification("Some inputs are not connected", "These Pins will be treated as OFF for the Simulation", NotificationType.Warning, 5000);

        let context = this.state.context;
        context.isSimulationRunning = true;

        const handle = setInterval(() => { this.simulate() }, 500)

        this.setState({ context: context, simulationHandle: handle, lastClickedPin: undefined });

        NotificationManager.addNotification("Starting Simulation", ' ', NotificationType.Info);
    }

    simulate() {
        this.state.chips.forEach(chip => {
            chip.graph.nodes.filter(gate => gate.role === GateRole.Clock && gate.firstLayer).forEach(clock => {
                clock.state = clock.state ? false : true;
            });
        });

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
                wires.push({ fromId: wire.from, toId: wire.to, state: false });
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
                allWires.push({ fromId: edge.from, toId: edge.to, state: false });
            });
        });

        allGates.forEach(gate => {
            if (gate.type !== GateType.Controlled && allWires.filter(wire => wire.toId === gate.id).length === 0)
                missingInputs.push(gate);
        })

        this.resetPinError();

        if (highlight && missingInputs.length > 0)
            this.setPinError(missingInputs);

        this.forceUpdate();

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

    getGatesByRole(role: GateRole, inFirstLayer: boolean): Gate[] {
        let result: Gate[] = [];

        this.state.chips.forEach(chip => {
            result.push(...chip.graph.nodes.filter(gate => gate.role === role && gate.firstLayer === true));
        });

        return result;
    }

    //#endregion

    render() {
        return (
            <div className="circuit-builder" >
                <ReactNotification />
                <Board context={this.state.context} chips={this.state.chips} wires={this.state.wires} onChipDelete={this.removeChipFromBoard.bind(this)} onPinClicked={this.addWireToBoard.bind(this)} onWireDelete={this.removeWireFromBoard.bind(this)} ></Board>
                <Toolbox blueprints={this.state.chipBlueprints} onChipClicked={(this.addChipToBoard.bind(this))}></Toolbox>
                <div className="toolbar-container">
                    <Toolbar>
                        <ToolbarGroup>
                            <ToolbarButtonMulti icon={Icons.iconPan} text="Pan" onClick={() => this.setTool(Tool.Pan)} isActive={this.state.context.activeTool === Tool.Pan}></ToolbarButtonMulti>
                            <ToolbarButtonMulti icon={Icons.iconSelect} text="Select" onClick={() => this.setTool(Tool.Select)} isActive={this.state.context.activeTool === Tool.Select}></ToolbarButtonMulti>
                            {/* <ToolbarButton icon={Icons.iconZoomIn} text="Zoom In" onClick={() => { }} ></ToolbarButton>
                            <ToolbarButton icon={Icons.iconZoomOut} text="Zoom Out" onClick={() => { }} ></ToolbarButton> */}
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarButtonMulti icon={Icons.iconMove} text="Move" onClick={() => this.setTool(Tool.Move)} isActive={this.state.context.activeTool === Tool.Move}></ToolbarButtonMulti>
                            <ToolbarButtonMulti icon={Icons.iconDelete} text="Delete" onClick={() => this.setTool(Tool.Delete)} isActive={this.state.context.activeTool === Tool.Delete}></ToolbarButtonMulti>
                            <ToolbarButtonMulti icon={Icons.iconRename} text="Rename" onClick={() => this.setTool(Tool.Rename)} isActive={this.state.context.activeTool === Tool.Rename}></ToolbarButtonMulti>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarButtonToggle iconInactive={Icons.iconPlay} iconActive={Icons.iconPause} textInctive="Start Simulation" textActive="Stop Simulation" isActive={this.state.context.isSimulationRunning} onClick={this.state.context.isSimulationRunning ? this.stopSimulation.bind(this) : this.startSimulation.bind(this)}></ToolbarButtonToggle>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarButton icon={Icons.iconChip} text="Package Chip" onClick={this.onPackageChip.bind(this)}></ToolbarButton>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarButton icon={Icons.iconSave} text="Save/ Load Blueprint" onClick={() => this.setState({ showSaveLoadModal: true })}></ToolbarButton>
                            <ToolbarButton icon={Icons.iconHelp} text="Show introduction" onClick={() => this.setState({ showWelcomeModal: true })}></ToolbarButton>
                            <ToolbarButton icon={Icons.iconTheme} text="Change Theme" onClick={this.props.onSwitchTheme}></ToolbarButton>
                            {/* <ToolbarButton icon={Icons.logo} text="Install on device" onClick={this.installPWA.bind(this)}></ToolbarButton> */}
                        </ToolbarGroup>
                    </Toolbar>
                </div >
                {
                    this.state.showPackageChipModal &&
                    <PackageChipModal onSubmitCallback={this.packageChip.bind(this)} onCloseCallback={() => this.setState({ showPackageChipModal: false })} defaultName={`Custom ${ChipManager.getChipId("Custom")}`} graph={this.getBlueprintGraph()} />
                }
                {
                    this.state.showSaveLoadModal &&
                    <LoadSaveModal onLoadCallback={this.loadBlueprints.bind(this)} onCloseCallback={() => this.setState({ showSaveLoadModal: false })} saveData={this.getBlueprintSaveJSON()} />
                }
                {
                    this.state.showWelcomeModal &&
                    <WelcomeMoal onCloseCallback={() => { this.setState({ showWelcomeModal: false }); localStorage.setItem(Constants.ShowWelcomeModalKey, "false") }} />
                }
            </div >
        );
    }
}

export default CircuitBuilder;