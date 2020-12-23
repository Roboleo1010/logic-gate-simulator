import ChipGrowable from '../chip-growable/chip-growable';
import React from 'react';
import './chip-binary-display.scss';

class ChipBinaryDisplay extends ChipGrowable {
    componentDidMount() {
        super.componentDidMount();
    }

    getBinaryDisplay(): JSX.Element {
        let result = 0;

        this.props.chip.graph.nodes.forEach(gate => {
            if (gate.state) result += Number(gate.data!);
        });

        return <span className="binary-display">{result}</span>
    }

    render() {
        return (
            <ChipGrowable chip={this.props.chip} context={this.props.context} isSelected={this.props.isSelected} onChipDelete={this.props.onChipDelete} onPinClicked={this.props.onPinClicked} redraw={this.props.redraw}>
                {this.getBinaryDisplay()}
            </ChipGrowable>);
    }
}

export default ChipBinaryDisplay;