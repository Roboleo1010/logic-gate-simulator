import React, { Component } from "react";
import Tab from "../tabs/tab/tab";
import TabNav from "../tabs/tabnav/tabnav";

import "./drawer.scss"

interface DrawerState {
    selectedTab: string;
}

class Drawer extends Component<{}, DrawerState> {

    constructor(props: any) {
        super(props);

        this.state = { selectedTab: 'Chips' };
    }

    setSelected(tap: string) {
        this.setState({ selectedTab: tap });
    }

    render() {
        return (
            <div className="drawer">
                <div className="drawer-header"></div>
                <TabNav tabs={['Chips', 'I/O', 'Oscilloscope']} selected={this.state.selectedTab} setSelected={this.setSelected.bind(this)}>
                    <Tab isSelected={this.state.selectedTab === 'Chips'}>
                        Chips
                    </Tab>
                    <Tab isSelected={this.state.selectedTab === 'I/O'}>
                        I/O
                    </Tab>
                    <Tab isSelected={this.state.selectedTab === 'Oscilloscope'}>
                        Oscilloscope
                    </Tab>
                </TabNav>
            </div>
        );
    }
}

export default Drawer;