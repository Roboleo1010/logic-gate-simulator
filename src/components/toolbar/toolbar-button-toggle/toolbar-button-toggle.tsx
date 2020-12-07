import Icons from '../../../assets/icons/icons';
import React, { Component } from 'react';
import '../toolbar-button.scss';

interface ToolbarButtonToggleProps {
    textActive: string;
    textInctive: string;
    iconActive: string;
    iconInactive: string;
    isActive: boolean;
    onClick: (newState: boolean) => void;
}

class ToolbarButtonToggle extends Component<ToolbarButtonToggleProps> {
    onClick() {
        const newState = !this.props.isActive;
        this.setState({ isActive: newState });
        this.props.onClick(newState);
    }

    render() {
        let className = "toolbar-button unselectable ";

        let style = {};
        if (this.props.isActive)
            style = { backgroundImage: `url('${Icons.backgroundImage}${this.props.iconActive}')` };
        else
            style = { backgroundImage: `url('${Icons.backgroundImage}${this.props.iconInactive}')` };

        return <div className={className} style={style} onClick={this.onClick.bind(this)} title={this.props.isActive ? this.props.textActive : this.props.textInctive}></div>
    }
}

export default ToolbarButtonToggle;