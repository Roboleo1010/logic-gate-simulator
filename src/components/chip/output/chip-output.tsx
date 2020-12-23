import Chip from '../chip';
import React from 'react';
import { GateRole } from '../../../model/circuit-builder.types';
import './chip-output.scss';

class ChipOutput extends Chip {
    componentDidMount() {
        super.componentDidMount();
    }

    render() {
        let className = '';

        if (this.props.context.isSimulationRunning) {
            let outputGate = this.props.chip.graph.nodes.find(gate => gate.role === GateRole.Output && gate.firstLayer);

            if (outputGate?.state)
                className += "chip-role-output-true";
            else
                className += "chip-role-output-false";
        }

        return <Chip chip={this.props.chip} context={this.props.context} isSelected={this.props.isSelected} onChipDelete={this.props.onChipDelete} onPinClicked={this.props.onPinClicked} extraClassName={className}></Chip>;
    }
}

export default ChipOutput;