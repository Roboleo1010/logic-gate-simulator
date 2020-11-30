import React, { Component } from 'react';
import ChipModel from '../../model/chip-model';
import ConnectorModel, { ConnectorDirection } from '../../model/connector-model';
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

    addChipToBoard(chip: ChipModel) {
        let newChips = this.state.chips;
        newChips.push(chip);

        this.setState({ chips: newChips })
    }

    onConnectorClicked(connector: ConnectorModel) {
        //First click
        if (!this.state.lastClickedConnector) {
            this.setState({ lastClickedConnector: connector });
            return;
        }

        //Checking for mistakes
        if (connector.name === this.state.lastClickedConnector.name) {
            console.warn("Can't Connect Wire to same connector.")
            this.setState({ lastClickedConnector: undefined });
            return;
        }

        if (connector.direction === this.state.lastClickedConnector.direction) {
            console.warn(`Can't Connect ${connector.direction} to ${connector.direction}`);
            this.setState({ lastClickedConnector: undefined });
            return;
        }

        //Creating new Wire
        console.log("Creatng Wire:", this.state.lastClickedConnector, connector);

        let newWires = this.state.wires;

        if (connector.direction === ConnectorDirection.SignalOut)
            newWires.push({ inputId: connector.name, outputId: this.state.lastClickedConnector.name });
        else
            newWires.push({ inputId: this.state.lastClickedConnector.name, outputId: connector.name });

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
