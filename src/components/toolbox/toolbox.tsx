import React, { Component } from "react";
import ChipBlueprint from "../../model/chip-blueprint";
import ChipDrawer from "../chip-drawer/chip-drawer";
import Tab from "../tabs/tab/tab";
import TabNav from "../tabs/tabnav/tabnav";

import "./toolbox.scss"

interface toolboxState {
    selectedTab: string;
}

class Toolbox extends Component<{}, toolboxState> {

    constructor(props: any) {
        super(props);

        this.state = { selectedTab: 'Chips' };
    }

    setSelected(tap: string) {
        this.setState({ selectedTab: tap });
    }

    render() {
        return (
            <div className="toolbox">
                <TabNav tabs={['Chips', 'I/O', 'Oscilloscope']} selected={this.state.selectedTab} setSelected={this.setSelected.bind(this)}>
                    <Tab isSelected={this.state.selectedTab === 'Chips'}>
                        <ChipDrawer chips={[new ChipBlueprint("AND", "#729B79"), new ChipBlueprint("NOT", "#D05353"), new ChipBlueprint("OR", "#FFA69E"), new ChipBlueprint("XOR", "#8EF9F3")]}></ChipDrawer>
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

export default Toolbox;