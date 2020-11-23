import React, { Component } from "react";
import { TabData } from "../tab.types";

import "./tabnav.scss"

interface TabNavProps {
    selectedId: string;
    tabs: TabData[]
    setSelected: (tap: TabData) => void;
}

class TabNav extends Component<TabNavProps> {

    render() {
        return (<div className="tabnav">
            <div className="tabnav-tabs">
                {this.props.tabs.map(tap => {
                    let classNames = 'tabnav-tab unselectable  ';
                    if (this.props.selectedId === tap.id)
                        classNames += 'tabnav-active '

                    return <div key={tap.id} className={classNames} onClick={() => this.props.setSelected(tap)}>{tap.name}</div>
                })}
            </div>

            {this.props.children}

        </div>);
    }
}

export default TabNav;