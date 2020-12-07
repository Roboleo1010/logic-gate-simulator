import Icons from '../../../assets/icons/icons';
import React, { Component } from 'react';
import '../toolbar-button.scss';

interface ToolbarButtonProps {
    text: string;
    icon: string;
    onClick: () => void;
}

class ToolbarButton extends Component<ToolbarButtonProps> {
    render() {
        let className = "toolbar-button unselectable ";

        let style = { backgroundImage: `url('${Icons.backgroundImage}${this.props.icon}')` };

        return <div className={className} style={style} onClick={this.props.onClick} title={this.props.text}></div>
    }
}

export default ToolbarButton;