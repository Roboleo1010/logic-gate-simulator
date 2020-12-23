import ChipGrowable from '../chip-growable/chip-growable';
import React from 'react';
import './chip-binary-input.scss';

class ChipBinaryInput extends ChipGrowable {
    componentDidMount() {
        super.componentDidMount();
    }

    getBinaryInput(): JSX.Element {
        const maxValue = Math.pow(2, this.props.chip.graph.nodes.length) - 1;

        const checkValidity = (e: any) => {
            if (!e.currentTarget.checkValidity()) {
                const value = e.currentTarget.value;
                if (value < 0)
                    e.currentTarget.value = 0;
                else
                    e.currentTarget.value = maxValue;
            }
        };

        const setOutputs = (e: any) => {
            const binaryString: string = Number(e.currentTarget.value).toString(2);

            let map = new Map();
            let j = 0;
            for (let i = binaryString.length - 1; i >= 0; i--)
                map.set(Math.pow(2, j++), binaryString[i]);

            this.props.chip.graph.nodes.forEach(gate => {
                gate.state = map.get(Number(gate.data)) === "1";
            });
        };

        return <div><input type="number" max={maxValue} min={0} defaultValue={0} onChange={(e) => { checkValidity(e); setOutputs(e) }} className="binary-input"></input></div >
    }

    render() {
        return (
            <ChipGrowable chip={this.props.chip} context={this.props.context} isSelected={this.props.isSelected} onChipDelete={this.props.onChipDelete} onPinClicked={this.props.onPinClicked} redraw={this.props.redraw}>
                {this.getBinaryInput()}
            </ChipGrowable>);
    }
}

export default ChipBinaryInput;