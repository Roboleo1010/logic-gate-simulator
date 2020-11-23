import React, { Component } from "react";

import "./tabnav.scss"

interface TabNavProps {
    selected: string;
    tabs: string[]
    setSelected: (tap: string) => void;
}

class TabNav extends Component<TabNavProps> {

    render() {
        return (<div className="tabnav">
            <div className="tabnav-tabs">
                {this.props.tabs.map(tap => {
                    let classNames = 'tabnav-tab unselectable  ';
                    if (this.props.selected === tap)
                        classNames += 'tabnav-active '

                    return <div key={tap} className={classNames} onClick={() => this.props.setSelected(tap)}>{tap}</div>
                })}
            </div>

            {this.props.children}

        </div>);
    }
}

export default TabNav;