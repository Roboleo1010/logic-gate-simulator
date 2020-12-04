import React, { Component } from 'react';
import ReactNotification from 'react-notifications-component'
import ChipModel from '../../model/chip-model';
import { ChipBlueprint, SignalDirection, ConnectorModel, Tool, Wire, Gate, GateFunction } from '../../model/circuit-builder.types';
import { SimulationState, TriState, Gate as SimulationGate } from '../../simulation/simulator.types';
import NotificationManager, { NotificationType } from '../../manager/notification-manager';
import Board from '../board/board';
import Toolbox from '../toolbox/toolbox';
import Simulation from '../../simulation/simulation';
import Toolbar from '../toolbar/toolbar';
import ToolbarGroup from '../toolbar/toolbar-group/toolbar-group';
import ToolbarButtonMulti from '../toolbar/toolbar-button-multi/toolbar-button-multi';
import ToolbarButtonToggle from '../toolbar/toolbar-button-toggle/toolbar-button-toggle';
import Icons from '../../assets/icons/icons';
import ToolbarButton from '../toolbar/toolbar-button/toolbar-button';
import CircuitBuilderContext from '../context/circuit-builder-context/circuit-builder-context';



import 'react-notifications-component/dist/theme.css'
import './circuit-builder.scss';
import ChipManager from '../../manager/chip-manager';


interface CircuitBuilderState {
    chips: ChipModel[];
    wires: Wire[];
    lastClickedConnector?: ConnectorModel;
    activeTool: Tool;
    simulationHandle?: any;
    clockChips: Gate[];
}

class CircuitBuilder extends Component<{}, CircuitBuilderState> {
    static contextType = CircuitBuilderContext;

    private simulation?: Simulation;

    constructor(props: any) {
        super(props);

        this.state = { chips: [], wires: [], clockChips: [], activeTool: Tool.Move, };
    }

    //#region events
    addChip(chipBlueprint: ChipBlueprint) {
        this.stopSimulation();

        let newChips = this.state.chips;
        newChips.push(new ChipModel(chipBlueprint));
        this.setState({ chips: newChips })
    }

    onConnectorClicked(connector: ConnectorModel) {
        this.stopSimulation();

        //First click
        if (!this.state.lastClickedConnector) {
            if (connector.direction === SignalDirection.Out) {
                this.setState({ lastClickedConnector: connector });
                return;
            }
            else {
                NotificationManager.addNotification("Wire Error", "Can't start Wire on Input.", NotificationType.Warning);
                this.setState({ lastClickedConnector: undefined });
                return;
            }
        }

        //Same Connector
        if (connector.id === this.state.lastClickedConnector.id) {
            NotificationManager.addNotification("Wire Error", "Can't Connect Wire to same connector.", NotificationType.Warning);
            this.setState({ lastClickedConnector: undefined });
            return;
        }

        //Input & input or out & out
        if (connector.direction === SignalDirection.Out) {
            NotificationManager.addNotification("Wire Error", "Can't end Wire on output.", NotificationType.Warning);
            this.setState({ lastClickedConnector: undefined });
            return;
        }

        //Two wires to same connector
        if ((this.state.wires.filter(wire => wire.outputId === connector.id)).length > 0) {
            NotificationManager.addNotification("Wire Error", "Can't Connect two Wires to same Input.", NotificationType.Warning);
            this.setState({ lastClickedConnector: undefined });
            return;
        }

        let newWires = this.state.wires;
        newWires.push({ inputId: this.state.lastClickedConnector.id, outputId: connector.id });

        this.setState({ wires: newWires, lastClickedConnector: undefined })

        return;
    }

    deleteChip(chipToDelete: ChipModel) {
        let gateIds = chipToDelete.gates.map(gate => gate.id);

        this.setState({
            chips: this.state.chips.filter(chip => chip.chipId !== chipToDelete.chipId),
            wires: this.state.wires.filter(wire => !gateIds.includes(wire.inputId) && !gateIds.includes(wire.outputId))
        });
    }

    deleteWire(wireToDelete: Wire) {
        this.setState({ wires: this.state.wires.filter(wire => wire.inputId !== wireToDelete.inputId || wire.outputId !== wireToDelete.outputId) });
    }

    switchTool(tool: Tool) {
        this.setState({ activeTool: tool, lastClickedConnector: undefined });
    }

    switchedSwitch(gate: Gate) {
        this.simulation?.changeGateState(gate.id, gate.state === TriState.True ? gate.state = TriState.False : gate.state = TriState.True)
    }

    packageChip() {
        this.stopSimulation();

        let gates = this.getGates();

        //Filter out inner relays set corresponing inputs & outputs
        gates.forEach(gate => {
            if (gate.direction === SignalDirection.In) {
                if (gate.inputs.length > 0)
                    gate.function = GateFunction.Relay
            }
            else if (gate.direction === SignalDirection.Out) {
                let gatesConnectedToMe: Gate[] = [];
                gates.forEach(g => g.inputs.forEach(input => { if (gate.id === input) gatesConnectedToMe.push(g) }));

                if (gatesConnectedToMe.length > 0)//has outgoing connections alle inputs wo meine id drin steht
                    gate.function = GateFunction.Relay;
            }
        });
        ChipManager.getInstance().addChip({ name: `Custom Chip ${ChipManager.getInstance().getNextChipId("custom")}`, color: '#0000ff', gates: gates });

        NotificationManager.addNotification("Packaged Chip", `The new Chip is saved as ${"NAME"} in the category Chips (Custom)`, NotificationType.Success);
    }
    //#endregion

    //#region Simulation
    startSimulation() {
        this.resetChipState();
        this.resetChipError();
        this.resetWireState();

        const gates: Gate[] = this.getGates();
        const clocks: Gate[] = gates.filter(gate => gate.function === GateFunction.Clock);

        this.simulation = new Simulation(gates);

        const handle = setInterval(() => { this.simulate() }, 500)

        this.setState({ simulationHandle: handle, clockChips: clocks });
        this.context.isSimulationRunning = true;

        NotificationManager.addNotification("Starting Simulation", ' ', NotificationType.Info);
    }

    getGates(): Gate[] {
        let gates: Gate[] = [];

        this.state.chips.forEach(chip => {
            chip.gates.forEach(gate => {
                gates.push(gate);
            });
        });

        this.state.wires.forEach(wire => {
            gates.filter(gate => gate.id === wire.outputId)[0].inputs = [wire.inputId]
        });

        return gates;
    }

    simulate() {
        console.log("Simulation Tick");

        //Setting Clock State
        this.state.clockChips.filter(gate => gate.function === GateFunction.Clock).forEach(clock => this.simulation?.changeGateState(clock.id, clock.state === TriState.True ? clock.state = TriState.False : clock.state = TriState.True));

        const result = this.simulation?.simulate()!;

        if (result.error) {
            console.error(result);

            if (result.missingConnections.length > 0) {
                this.setChipError(result.missingConnections);
                NotificationManager.addNotification("Connections missing", 'Wire all marked Connectors.', NotificationType.Warning);
            }
            else
                NotificationManager.addNotification("Simulation Error", `An unknown error occured during the simulation. Please try again.`, NotificationType.Error);

            this.stopSimulation();
        }
        else {
            this.setConnectorState(result.states);
            this.setWireState(result.states);
        }

        this.forceUpdate();
    }

    stopSimulation() {
        if (!this.context.isSimulationRunning)
            return;

        NotificationManager.addNotification("Stopping Simulation", ' ', NotificationType.Info);
        clearInterval(this.state.simulationHandle);
        this.setState({ simulationHandle: undefined });
        this.context.isSimulationRunning = false;
        this.simulation = undefined;

        this.resetChipState();
        this.resetWireState();
    }
    //#endregion

    //#region Setting Connector/ Wire State/ Error
    setConnectorState(results: SimulationState[]) {
        this.state.chips.forEach(chip => {
            chip.connectors.forEach(connectorSide => {
                connectorSide.forEach(connector => {
                    const result = results.find(res => res.id === connector.id);
                    connector.gate.state = result?.state!;
                });
            });
        });
    }

    setWireState(results: SimulationState[]) {
        this.state.wires.forEach(wire => {
            const result = results.find(res => res.id === wire.inputId);
            wire.state = result?.state;
        })
    }

    setChipError(errors: string[]) {
        this.state.chips.forEach(chip => {
            chip.connectors.forEach(connectorSide => {
                connectorSide.forEach(connector => {
                    if (errors.find(error => error === connector.id))
                        connector.error = true;
                });
            });
        });
    }

    resetChipState() {
        this.state.chips.forEach(chip => {
            chip.connectors.forEach(connectorSide => {
                connectorSide.forEach(connector => {
                    connector.gate.state = TriState.Floating;
                });
            });
        });
    }

    resetWireState() {
        this.state.wires.forEach(wire => {
            wire.state = TriState.Floating;
        })
    }

    resetChipError() {
        this.state.chips.forEach(chip => {
            chip.connectors.forEach(connectorSide => {
                connectorSide.forEach(connector => {
                    connector.error = false;
                });
            });
        });
    }
    //#endregion

    render() {
        return (
            <div className="circuit-builder" >
                <ReactNotification />
                <Board chips={this.state.chips} wires={this.state.wires} activeTool={this.state.activeTool} onConnectorClicked={this.onConnectorClicked.bind(this)} onChipDelete={this.deleteChip.bind(this)} onWireDelete={this.deleteWire.bind(this)} redraw={() => this.forceUpdate()} onSwitchSwitched={this.switchedSwitch.bind(this)}></Board>
                <Toolbox onChipClicked={this.addChip.bind(this)}></Toolbox>
                <div className="toolbar-container">
                    <Toolbar>
                        <ToolbarGroup>
                            <ToolbarButtonMulti icon={Icons.iconMove} text="Move" onClick={() => this.switchTool(Tool.Move)} isActive={this.state.activeTool === Tool.Move}></ToolbarButtonMulti>
                            <ToolbarButtonMulti icon={Icons.iconDelete} text="Delete" onClick={() => this.switchTool(Tool.Delete)} isActive={this.state.activeTool === Tool.Delete}></ToolbarButtonMulti>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarButtonToggle iconInactive={Icons.iconPlay} iconActive={Icons.iconPause} textInctive="Start Simulation" textActive="Stop Simulation" isActive={this.context.isSimulationRunning} onClick={(newState: boolean) => { newState ? this.startSimulation() : this.stopSimulation() }}></ToolbarButtonToggle>
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