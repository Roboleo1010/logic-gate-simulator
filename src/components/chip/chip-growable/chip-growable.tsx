import Chip from '../chip';
import React from 'react';
import { Gate } from '../../../model/circuit-builder.types';
import './chip-growable.scss';

class ChipGrowable extends Chip {
    addGrowableGate() {
        if (this.props.chip.blueprint.growableData) {
            const growableData = this.props.chip.blueprint.growableData;
            let gate: Gate = { ...growableData.gate };

            gate.id = this.handlePlaceholder(gate.id);
            if (gate.name)
                gate.name = this.handlePlaceholder(gate.name);
            if (gate.data)
                gate.data = this.handlePlaceholder(gate.data);

            this.props.chip.graph.addNode(gate);
            this.setState({ growableIndex: this.state.growableIndex + 1 });
            this.props.redraw();
        }
    }

    removeGrowableGate() {
    }

    handlePlaceholder(placeholder: string): string {
        let resultPowToIndex = new RegExp(/\[pow:(\d+),i\]/).exec(placeholder); //"out [pow:2,i]"  

        if (resultPowToIndex && resultPowToIndex.length === 2)
            return placeholder.replace(/\[.*?\]/, `${Math.pow(Number(resultPowToIndex[1]), this.state.growableIndex)}`);
        else
            return placeholder;
    }

    render() {
        return (
            <Chip chip={this.props.chip} context={this.props.context} isSelected={this.props.isSelected} onChipDelete={this.props.onChipDelete} onPinClicked={this.props.onPinClicked} redraw={this.props.redraw}>
                {this.props.children}
                <div className="growable-wrapper">
                    <div className="grow-button" id="add" onClick={this.addGrowableGate.bind(this)}>+</div>
                    <div className="grow-button" id="remove" onClick={this.removeGrowableGate.bind(this)}>-</div>
                </div>
            </Chip>);
    }
}

export default ChipGrowable;