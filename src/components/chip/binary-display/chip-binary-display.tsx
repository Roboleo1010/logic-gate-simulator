import Chip from '../chip';
import React from 'react';
import './chip-binary-display.scss';

class ChipBinaryDisplay extends Chip {
    componentDidMount() {
        super.componentDidMount();
    }

    getBinaryDisplay(): JSX.Element {
        if (this.props.context.isSimulationRunning) {
            let result = 0;

            this.props.chip.graph.nodes.forEach(gate => {
                if (gate.state) result += Number(gate.data!);
            });

            return <span className="binary-display">{result}</span>
        }
        else
            return <></>
    }

    render() {
        return <Chip chip={this.props.chip} context={this.props.context} isSelected={this.props.isSelected} onChipDelete={this.props.onChipDelete} onPinClicked={this.props.onPinClicked}>
            {this.getBinaryDisplay()}
        </Chip>
    }
}

export default ChipBinaryDisplay;