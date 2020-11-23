import React, { Component } from "react";
import ChipBlueprint from "../../model/chip-blueprint";
import ChipToolbox from "../chip/chip-toolbox";
import Tab from "../tabs/tab/tab";
import TabNav from "../tabs/tabnav/tabnav";

import "./toolbox.scss"

interface ToolboxState {
    selectedTab: string;
    chips: ChipBlueprint[];
    chipsIo: ChipBlueprint[];
}

class Toolbox extends Component<{}, ToolboxState> {

    constructor(props: any) {
        super(props);

        this.state = {
            selectedTab: 'Chips',
            chips: [new ChipBlueprint("AND", "#729B79"), new ChipBlueprint("NOT", "#D05353"), new ChipBlueprint("OR", "#FFA69E"), new ChipBlueprint("XOR", "#8EF9F3")],
            chipsIo: []
        };
    }

    setSelected(tap: string) {
        this.setState({ selectedTab: tap });
    }

    render() {
        return (
            <div className="toolbox">
                <TabNav tabs={['Chips', 'I/O', 'Oscilloscope']} selected={this.state.selectedTab} setSelected={this.setSelected.bind(this)}>
                    <Tab isSelected={this.state.selectedTab === 'Chips'}>
                        <div className="tab-chips">
                            {this.state.chips.map(chip => {
                                return <ChipToolbox chip={chip} key={chip.name}></ChipToolbox>;
                            })}
                        </div>
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