import React, { Component } from 'react';
import ReactNotification from 'react-notifications-component'
import Icons from '../../assets/icons/icons';
import ChipModel from '../../model/chip-model';
import { ChipBlueprint, ConnectorDirection, ConnectorModel, Tool } from '../../model/circuit-builder.types';
import { Gate, SimulationResult, SimulationState, TriState, Wire } from '../../simulation/simulator.types';
import NotificationManager, { NotificationType } from '../../manager/notification-manager';
import ActionButton from '../action-button/action-button';
import Board from '../board/board';
import Toolbox from '../toolbox/toolbox';
import Worker from '../../worker'

import 'react-notifications-component/dist/theme.css'
import './circuit-builder.scss';

interface CircuitBuilderState {
    chips: ChipModel[];
    wires: Wire[];
    lastClickedConnector?: ConnectorModel;
    activeTool: Tool;
}

class CircuitBuilder extends Component<{}, CircuitBuilderState> {

    constructor(props: any) {
        super(props);

        this.state = {
            chips: [],
            wires: [],
            activeTool: Tool.move
        };
    }

    redraw() {
        this.forceUpdate();
    }

    addChipToBoard(chipBlueprint: ChipBlueprint) {
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
                console.warn("Can't start Wire on Input.")
                this.setState({ lastClickedConnector: undefined });
                return;
            }
        }

        //Same Connector
        if (connector.id === this.state.lastClickedConnector.id) {
            console.warn("Can't Connect Wire to same connector.")
            this.setState({ lastClickedConnector: undefined });
            return;
        }

        //Input & input or out & out
        if (connector.direction === ConnectorDirection.SignalOut) {
            console.warn("Can't end Wire on output.")
            this.setState({ lastClickedConnector: undefined });
            return;
        }

        //Two wires to same connector
        if ((this.state.wires.filter(wire => wire.outputId === connector.id)).length > 0) {
            console.warn("Can't Connect two Wires to same Input.")
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
    }

    onSimulate() {
        let gates: Gate[] = [];

        this.state.chips.forEach(chip => {
            chip.gates.forEach(gate => {
                gates.push(gate);
            });
        });

        const worker = new Worker();

        return new Promise(async resolve => {
            const result: SimulationResult = await worker.simulate(gates, this.state.wires);
            resolve(result);

            this.resetChipState();
            this.resetChipError();
            this.resetWireState();

            if (result.error) {
                console.error(result);

                if (result.missingConnections.length > 0)
                    this.setChipError(result.missingConnections);
                else
                    NotificationManager.addNotification("Simulation Error", `An unknown error occured during the simulation. Please try again.`, NotificationType.Error);
            }
            else {
                NotificationManager.addNotification("Finished Simulation", ' ', NotificationType.Success);
                this.setConnectorState(result.states);
                this.setWireState(result.states);
            }

            this.redraw();
        });
    }

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
                    if (errors.find(error => error === connector.id)) {
                        connector.error = true;
                        NotificationManager.addNotification("Connection missing", `Missing connection at ${connector.id}.`, NotificationType.Warning);
                    }
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
                <Board chips={this.state.chips} wires={this.state.wires} activeTool={this.state.activeTool} onConnectorClicked={this.onConnectorClicked.bind(this)} onChipDelete={this.onChipDelete.bind(this)} onWireDelete={this.onWireDelete.bind(this)} redraw={this.redraw.bind(this)}></Board>
                <Toolbox onChipClicked={this.addChipToBoard.bind(this)}></Toolbox>
                <div className="action-bar">
                    <ActionButton key={"tool-drag"} text={"Move"} icon={Icons.iconDrag} onClick={() => this.switchTool(Tool.move)} active={this.state.activeTool === Tool.move}></ActionButton>
                    <ActionButton key={"tool-delete"} text={"Delete"} icon={Icons.iconDelete} onClick={() => this.switchTool(Tool.delete)} active={this.state.activeTool === Tool.delete}></ActionButton>
                    <ActionButton key={"tool-simulate"} text={"Simulate"} icon={Icons.iconPlay} onClick={this.onSimulate.bind(this)} active={false}></ActionButton>
                </div>
            </div>
        );
    }
}

export default CircuitBuilder;
