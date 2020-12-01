import React, { Component } from "react";

import "./action-button.scss";

interface ActionButtonProps {
    text: string;
    active: boolean;
    onClick: () => void;
}


class ActionButton extends Component<ActionButtonProps> {
    render() {
        let className = "action-button unselectable ";

        if (this.props.active)
            className += "action-button-active";
        else
            className += "action-button-inactive";

        return <div className={className} onClick={this.props.onClick} title={this.props.text}></div>
    }
}

export default ActionButton;