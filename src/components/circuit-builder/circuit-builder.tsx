import React, { Component } from 'react';
import ReactNotification from 'react-notifications-component'
import Icons from '../../assets/icons/icons';
import ChipModel from '../../model/chip-model';
import { ChipBlueprint, ConnectorDirection, ConnectorModel, Tool } from '../../model/circuit-builder.types';
import { Gate, GateFunction, SimulationState, TriState, Wire } from '../../simulation/simulator.types';
import NotificationManager, { NotificationType } from '../../manager/notification-manager';
import ToolbarButton from '../toolbar-button/toolbar-button';
import Board from '../board/board';
import Toolbox from '../toolbox/toolbox';

import 'react-notifications-component/dist/theme.css'
import './circuit-builder.scss';
import Simulation from '../../simulation/simulation';

interface CircuitBuilderState {
    chips: ChipModel[];
    wires: Wire[];
    lastClickedConnector?: ConnectorModel;
    activeTool: Tool;
    isSimulationRunning: boolean;
    simulationHandle?: any;
    clockChips: Gate[];
}

class CircuitBuilder extends Component<{}, CircuitBuilderState> {
    private simulation?: Simulation;

    constructor(props: any) {
        super(props);

        this.state = {
            chips: [],
            wires: [],
            clockChips: [],
            activeTool: Tool.Move,
            isSimulationRunning: false,
        };
    }

    //#region events
    redraw() {
        this.forceUpdate();
    }

    addChipToBoard(chipBlueprint: ChipBlueprint) {
        this.switchTool(Tool.Move);

        let chip = new ChipModel(chipBlueprint);

        let newChips = this.state.chips;
        newChips.push(chip);
        this.setState({ chips: newChips })
    }

    onConnectorClicked(connector: ConnectorModel) {
        //First click
        if (!this.state.lastClickedConnector) {
            if (connector.direction === ConnectorDirection.SignalOut) {
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
        if (connector.direction === ConnectorDirection.SignalOut) {
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

    onChipDelete(chipToDelete: ChipModel) {
        let gateIds = chipToDelete.gates.map(gate => gate.id);

        this.setState({
            chips: this.state.chips.filter(chip => chip.id !== chipToDelete.id),
            wires: this.state.wires.filter(wire => !gateIds.includes(wire.inputId) && !gateIds.includes(wire.outputId))
        });
    }

    onWireDelete(wireToDelete: Wire) {
        this.setState({ wires: this.state.wires.filter(wire => wire.inputId !== wireToDelete.inputId || wire.outputId !== wireToDelete.outputId) });
    }

    switchTool(tool: Tool) {
        this.setState({ activeTool: tool, lastClickedConnector: undefined });

        if (!this.state.isSimulationRunning && tool === Tool.Simulate)
            this.startSimulation();
        else if (this.state.isSimulationRunning && tool !== Tool.Simulate)
            this.stopSimulation();
    }

    onSwitchSwitched(gate: Gate) {
        this.simulation?.changeGateState(gate.id, gate.state === TriState.True ? gate.state = TriState.False : gate.state = TriState.True)
    }
    //#endregion

    //#region Simulation
    startSimulation() {
        this.resetChipState();
        this.resetChipError();
        this.resetWireState();

        let gates: Gate[] = [];
        let clocks: Gate[] = [];

        this.state.chips.forEach(chip => {
            chip.gates.forEach(gate => {
                gates.push(gate);

                if (gate.function === GateFunction.Clock)
                    clocks.push(gate);
            });
        });

        this.simulation = new Simulation(gates, this.state.wires);

        const handle = setInterval(() => { this.simulate() }, 1000)

        this.setState({ simulationHandle: handle, isSimulationRunning: true, clockChips: clocks });
        NotificationManager.addNotification("Starting Simulation", ' ', NotificationType.Info);
    }

    simulate() {
        console.log("Simulation Tick");

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

            this.switchTool(Tool.Move);
        }
        else {
            this.setConnectorState(result.states);
            this.setWireState(result.states);
        }

        this.redraw();
    }

    stopSimulation() {
        NotificationManager.addNotification("Stopping Simulation", ' ', NotificationType.Info);
        clearInterval(this.state.simulationHandle);
        this.setState({ simulationHandle: undefined, isSimulationRunning: false });
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
                    connector.state = result?.state!;
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
                    connector.state = TriState.Floating;
                });
            });
        });
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

    resetWireState() {
        this.state.wires.forEach(wire => {
            wire.state = TriState.Floating;
        })
    }
    //#endregion

    render() {
        return (
            <div className="circuit-builder" >
                <ReactNotification />
                <Board chips={this.state.chips} wires={this.state.wires} activeTool={this.state.activeTool} onConnectorClicked={this.onConnectorClicked.bind(this)} onChipDelete={this.onChipDelete.bind(this)} onWireDelete={this.onWireDelete.bind(this)} redraw={this.redraw.bind(this)} onSwitchSwitched={this.onSwitchSwitched.bind(this)}></Board>
                <Toolbox onChipClicked={this.addChipToBoard.bind(this)}></Toolbox>
                <div className="action-bar">
                    <ToolbarButton key={"tool-drag"} text={"Move"} icon={Icons.iconDrag} onClick={() => this.switchTool(Tool.Move)} active={this.state.activeTool === Tool.Move}></ToolbarButton>
                    <ToolbarButton key={"tool-delete"} text={"Delete"} icon={Icons.iconDelete} onClick={() => this.switchTool(Tool.Delete)} active={this.state.activeTool === Tool.Delete}></ToolbarButton>
                    <ToolbarButton key={"tool-simulate"} text={"Simulate"} icon={Icons.iconPlay} onClick={() => this.switchTool(Tool.Simulate)} active={this.state.activeTool === Tool.Simulate}></ToolbarButton>
                </div>
            </div>
        );
    }
}

export default CircuitBuilder;
