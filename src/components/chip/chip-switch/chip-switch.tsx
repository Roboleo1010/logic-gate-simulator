import Chip from '../chip';
import React from 'react';
import { GateRole } from '../../../model/circuit-builder.types';
import './chip-switch.scss';

class ChipSwitch extends Chip {
    componentDidMount() {
        super.componentDidMount();
    }

    render() {
        let className = '';
        let clickEvent = () => { };

        if (this.props.context.isSimulationRunning) {
            className += "chip-role-switch";

            let switchGate = this.props.chip.graph.nodes.find(gate => gate.role === GateRole.Switch && gate.firstLayer);
            clickEvent = () => { switchGate!.state = switchGate!.state ? false : true };
        }

        return <Chip chip={this.props.chip} context={this.props.context} isSelected={this.props.isSelected} onChipDelete={this.props.onChipDelete} onPinClicked={this.props.onPinClicked} extraClassName={className} extraClickEvent={clickEvent} redraw={this.props.redraw}></Chip>;
    }
}

export default ChipSwitch;