import React, { Component } from "react";
import Icons from "../../assets/icons/icons";

import "./action-button.scss";

interface ActionButtonProps {
    text: string;
    active: boolean;
    icon: string;
    onClick: () => void;
}


class ActionButton extends Component<ActionButtonProps> {
    render() {
        let className = "action-button unselectable ";

        if (this.props.active)
            className += "action-button-active";
        else
            className += "action-button-inactive";

        let style = { backgroundImage: `url('${Icons.backgroundImage}${this.props.icon}')` };

        return <div className={className} style={style} onClick={this.props.onClick} title={this.props.text}></div>
    }
}

export default ActionButton;