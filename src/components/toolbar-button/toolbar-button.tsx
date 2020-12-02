import React, { Component } from "react";
import Icons from "../../assets/icons/icons";

import "./toolbar-button.scss";

interface ToolbarButtonProps {
    text: string;
    active: boolean;
    icon: string;
    onClick: () => void;
}


class ToolbarButton extends Component<ToolbarButtonProps> {
    render() {
        let className = "toolbar-button unselectable ";

        if (this.props.active)
            className += "toolbar-button-active";
        else
            className += "toolbar-button-inactive";

        let style = { backgroundImage: `url('${Icons.backgroundImage}${this.props.icon}')` };

        return <div className={className} style={style} onClick={this.props.onClick} title={this.props.text}></div>
    }
}

export default ToolbarButton;