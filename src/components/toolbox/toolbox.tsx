import React, { Component } from "react";
import ChipManager from "../../manager/chip-manager";
import { ChipBlueprint } from "../../model/circuit-builder.types";
import ChipToolbox from "../chip/chip-toolbox";
import { TabData } from "../tabs/tab.types";
import Tab from "../tabs/tab/tab";
import TabNav from "../tabs/tabnav/tabnav";

import "./toolbox.scss"

interface ToolboxState {
    selectedTab: string;
    chipsLogic: ChipBlueprint[];
    chipsInOut: ChipBlueprint[];
    chipsCustom: ChipBlueprint[];
}

interface ToolboxProps {
    onChipClicked: (chip: ChipBlueprint) => void;
}

class Toolbox extends Component<ToolboxProps, ToolboxState> {
    constructor(props: ToolboxProps) {
        super(props);
        let chipManager = ChipManager.getInstance();
        chipManager.chipAddedCallback = this.chipBlueprintAddedCallback.bind(this);

        this.state = {
            selectedTab: 'chips-logic',
            chipsLogic: chipManager.getChipsByCategory('logic'),
            chipsInOut: chipManager.getChipsByCategory('io'),
            chipsCustom: chipManager.getChipsByCategory('')
        };
    }

    setSelected(tab: TabData) {
        this.setState({ selectedTab: tab.id });
    }

    chipBlueprintAddedCallback() {
        let chipManager = ChipManager.getInstance();

        this.setState({
            chipsLogic: chipManager.getChipsByCategory('logic'),
            chipsInOut: chipManager.getChipsByCategory('io'),
            chipsCustom: chipManager.getChipsByCategory('')
        });
    }

    render() {
        const tabs: TabData[] = [{ id: 'chips-logic', name: 'Chips (Logic)' }, { id: 'chips-io', name: 'Chips (In/ Out)' }, { id: 'chips-custom', name: 'Chips (Custom)' }, { id: 'oscilloscope', name: 'Oscilloscope' }];

        return (
            <div className="toolbox">
                <TabNav tabs={tabs} selectedId={this.state.selectedTab} setSelected={this.setSelected.bind(this)}>
                    <Tab isSelected={this.state.selectedTab === tabs[0].id}>
                        <div className="tab-chips">
                            {this.state.chipsLogic.map(chip => {
                                return <ChipToolbox chipBlueprint={chip} key={chip.name} onChipClicked={this.props.onChipClicked}></ChipToolbox>;
                            })}
                        </div>
                    </Tab>
                    <Tab isSelected={this.state.selectedTab === tabs[1].id}>
                        <div className="tab-chips">
                            {this.state.chipsInOut.map(chip => {
                                return <ChipToolbox chipBlueprint={chip} key={chip.name} onChipClicked={this.props.onChipClicked}></ChipToolbox>;
                            })}
                        </div>
                    </Tab>
                    <Tab isSelected={this.state.selectedTab === tabs[2].id}>
                        <div className="tab-chips">
                            {this.state.chipsCustom.map(chip => {
                                return <ChipToolbox chipBlueprint={chip} key={chip.name} onChipClicked={this.props.onChipClicked}></ChipToolbox>;
                            })}
                        </div>
                    </Tab>
                    <Tab isSelected={this.state.selectedTab === tabs[3].id}>

                    </Tab>
                </TabNav>
            </div>
        );
    }
}

export default Toolbox;