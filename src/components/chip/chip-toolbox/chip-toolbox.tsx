import Draggable from '../../draggable/draggable';
import React, { Component } from 'react';
import { ChipBlueprint, Vector2 } from '../../../model/circuit-builder.types';
import './chip-toolbox.scss';

interface ChipToolboxProps {
    blueprint: ChipBlueprint;
    onChipClicked: (chip: ChipBlueprint, position: Vector2) => void;
}

interface ChipToolboxState {
    chipRef: React.RefObject<HTMLDivElement>;
}

class ChipToolbox extends Component<ChipToolboxProps, ChipToolboxState> {
    constructor(props: ChipToolboxProps) {
        super(props);

        this.state = { chipRef: React.createRef() };
    }

    onStop(translation: Vector2) {
        const rect = this.state.chipRef.current!.getBoundingClientRect();

        if (translation.y < -100)
            this.props.onChipClicked(this.props.blueprint, { x: rect.x, y: rect.y });
    }

    render() {
        let style = { backgroundColor: this.props.blueprint.color };

        return (
            <div className="chip-on-toolbox-wrapper">
                <Draggable enabled={true} resetAfterStop={true} onDragEnd={this.onStop.bind(this)}>
                    <div ref={this.state.chipRef} className="chip chip-on-toolbox" style={style} title={this.props.blueprint.description} >
                        <span className="title">{this.props.blueprint.name}</span>
                    </div>
                </Draggable>

                {/* Fake Chip */}
                <div className="chip chip-on-toolbox chip-on-toolbox-fake" style={style} >
                    <span>{this.props.blueprint.name}</span>
                </div>
            </div>
        );
    }
}

export default ChipToolbox;