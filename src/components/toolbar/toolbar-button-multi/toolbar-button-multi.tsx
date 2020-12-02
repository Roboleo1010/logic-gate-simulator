import React, { Component } from "react";
import Icons from "../../../assets/icons/icons";

import '../toolbar-button.scss';

interface ToolbarButtonMultiProps {
    text: string;
    icon: string;
    onClick: () => void;
    isActive: boolean;
}


class ToolbarButtonMulti extends Component<ToolbarButtonMultiProps> {
    render() {
        let className = "toolbar-button unselectable ";
        if (this.props.isActive)
            className += " toolbar-button-active"
        else
            className += " toolbar-button-inactive"

        let style = { backgroundImage: `url('${Icons.backgroundImage}${this.props.icon}')` };

        return <div className={className} style={style} onClick={this.props.onClick} title={this.props.text}></div>
    }
}

export default ToolbarButtonMulti;