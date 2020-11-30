import React, { Component } from 'react';
import ChipModel from '../../model/chip-model';
import { ChipBlueprint, ConnectorDirection, ConnectorModel } from '../../model/circuit-builder.types';
import Simulation from '../../simulation/simulation';
import { Wire } from '../../simulation/wire';
import Board from '../board/board';
import Toolbox from '../toolbox/toolbox';

import './circuit-builder.scss';

interface CircuitBuilderState {
    chips: ChipModel[];
    wires: Wire[];
    lastClickedConnector?: ConnectorModel;
}

class CircuitBuilder extends Component<{}, CircuitBuilderState> {

    constructor(props: any) {
        super(props);

        this.state = {
            chips: [],
            wires: []
        };

        Simulation.getInstance().simulate();
    }

    addChipToBoard(chip: ChipBlueprint) {
        let newChips = this.state.chips;
        newChips.push(new ChipModel(chip));

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

        //Creating new Wire
        console.log("Creatng Wire:", this.state.lastClickedConnector, connector);

        let newWires = this.state.wires;
        newWires.push({ inputId: this.state.lastClickedConnector.id, outputId: connector.id });

        this.setState({ wires: newWires, lastClickedConnector: undefined })

        return;
    }

    render() {
        return (
            <div className="circuit-builder">
                <Board onConnectorClicked={this.onConnectorClicked.bind(this)} chips={this.state.chips} wires={this.state.wires}></Board>
                <Toolbox onChipClicked={this.addChipToBoard.bind(this)}></Toolbox>
            </div>
        );
    }
}

export default CircuitBuilder;
