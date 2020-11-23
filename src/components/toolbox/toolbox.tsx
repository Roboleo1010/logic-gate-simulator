import React, { Component } from "react";
import ChipBlueprint from "../../model/chip-blueprint";
import ConnectorBlueprint, { ConnectorDirection, ConnectorSide } from "../../model/connector-blueprint";
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

        this.state = {
            selectedTab: 'chips-logic',
            chipsLogic: [new ChipBlueprint("AND", "#729B79", [new ConnectorBlueprint("in1", ConnectorSide.Left, ConnectorDirection.SignalIn), new ConnectorBlueprint("in2", ConnectorSide.Left, ConnectorDirection.SignalIn), new ConnectorBlueprint("out1", ConnectorSide.Right, ConnectorDirection.SignalOut)]), new ChipBlueprint("NOT", "#D05353", [new ConnectorBlueprint("in1", ConnectorSide.Left, ConnectorDirection.SignalIn), new ConnectorBlueprint("out1", ConnectorSide.Right, ConnectorDirection.SignalOut)])],
            chipsInOut: [new ChipBlueprint("Input", "#386FA4", [new ConnectorBlueprint("out1", ConnectorSide.Right, ConnectorDirection.SignalOut)]), new ChipBlueprint("Output", "#386FA4", [new ConnectorBlueprint("out1", ConnectorSide.Right, ConnectorDirection.SignalOut)]), new ChipBlueprint("Constant On", "#6DA34D", [new ConnectorBlueprint("out1", ConnectorSide.Right, ConnectorDirection.SignalOut)]), new ChipBlueprint("Constant Off", "#D10000", [new ConnectorBlueprint("out1", ConnectorSide.Right, ConnectorDirection.SignalOut)]), new ChipBlueprint("Oscilloscope", "#000000", [new ConnectorBlueprint("in1", ConnectorSide.Left, ConnectorDirection.SignalIn)])],
            chipsCustom: []
        };
    }

    setSelected(tap: TabData) {
        this.setState({ selectedTab: tap.id });
    }

    render() {
        const tabs: TabData[] = [{ id: 'chips-logic', name: 'Chips (Logic)' }, { id: 'chips-io', name: 'Chips (In/ Out)' }, { id: 'chips-custom', name: 'Chips (Custom)' }, { id: 'oscilloscope', name: 'Oscilloscope' }];

        return (
            <div className="toolbox">
                <TabNav tabs={tabs} selectedId={this.state.selectedTab} setSelected={this.setSelected.bind(this)}>
                    <Tab isSelected={this.state.selectedTab === tabs[0].id}>
                        <div className="tab-chips">
                            {this.state.chipsLogic.map(chip => {
                                return <ChipToolbox chip={chip} key={chip.name} onChipClicked={this.props.onChipClicked}></ChipToolbox>;
                            })}
                        </div>
                    </Tab>
                    <Tab isSelected={this.state.selectedTab === tabs[1].id}>
                        <div className="tab-chips">
                            {this.state.chipsInOut.map(chip => {
                                return <ChipToolbox chip={chip} key={chip.name} onChipClicked={this.props.onChipClicked}></ChipToolbox>;
                            })}
                        </div>
                    </Tab>
                    <Tab isSelected={this.state.selectedTab === tabs[2].id}>
                        <div className="tab-chips">
                            {this.state.chipsCustom.map(chip => {
                                return <ChipToolbox chip={chip} key={chip.name} onChipClicked={this.props.onChipClicked}></ChipToolbox>;
                            })}
                        </div>
                    </Tab>
                    <Tab isSelected={this.state.selectedTab === tabs[3].id}>
                        TODO
                    </Tab>
                </TabNav>
            </div>
        );
    }
}

export default Toolbox;