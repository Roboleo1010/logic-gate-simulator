import React, { Component } from "react";

import "./action-button.scss";

interface ActionButtonProps {
    icon: string;
    text: string;
    backgroundColor: string;
    onClick: () => void;
}

class ActionButton extends Component<ActionButtonProps> {

    render() {
        return <div className={"action-button unselectable"} style={{ backgroundColor: this.props.backgroundColor }} onClick={this.props.onClick} title={this.props.text}></div>
    }
}

export default ActionButton;