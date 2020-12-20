import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import React, { Component } from 'react';
import { ChipBlueprint, Vector2 } from '../../model/circuit-builder.types';
import './chip.scss';

interface ChipToolboxProps {
    blueprint: ChipBlueprint;
    onChipClicked: (chip: ChipBlueprint, position: Vector2) => void;
}

class ChipToolbox extends Component<ChipToolboxProps> {
    onStop(e: DraggableEvent, ui: DraggableData) {
        if (ui.lastY < -75) {
            let rect = ui.node.getBoundingClientRect();
            this.props.onChipClicked(this.props.blueprint, { x: rect.x, y: rect.y });
        }

        this.forceUpdate(); //To reset position
    }

    render() {
        let style = { backgroundColor: this.props.blueprint.color };

        return (
            <div className="chip-on-toolbox-wrapper">
                <Draggable grid={[5, 5]} onStop={this.onStop.bind(this)} position={{ x: 0, y: 0 }} >
                    <div className="chip chip-on-toolbox" style={style} title={this.props.blueprint.description} >
                        <span className="title">{this.props.blueprint.name}</span>
                    </div>
                </Draggable>

                {/* Fake Chip */}
                <div className="chip chip-on-toolbox chip-on-toolbox-fake" style={style} >
                    <span className="title">{this.props.blueprint.name}</span>
                </div>
            </div>
        );
    }
}

export default ChipToolbox;