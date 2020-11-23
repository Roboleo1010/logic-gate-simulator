import React, { Component } from "react";

import "./tab.scss"

interface TabProps {
    isSelected: boolean;
}

class Tab extends Component<TabProps> {

    render() {
        if (this.props.isSelected)
            return (<div className="tab">{this.props.children}</div>);
        else
            return null;
    }
}

export default Tab;