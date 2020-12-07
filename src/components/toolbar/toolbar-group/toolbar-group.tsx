import React, { Component } from 'react';
import './toolbar-group.scss';

class ToolbarGroup extends Component {
    render() {
        return <div className="toolbar-group">
            {this.props.children}
        </div>;
    }
}

export default ToolbarGroup;