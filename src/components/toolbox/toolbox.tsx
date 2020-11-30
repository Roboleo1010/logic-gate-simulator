import React, { Component } from "react";
import ChipModel from "../../model/chip-model";
import ConnectorModel, { ConnectorDirection, ConnectorSide } from "../../model/connector-model";
import ChipFactory from "../../simulation/ChipFactory";
import ChipToolbox from "../chip/chip-toolbox";
import { TabData } from "../tabs/tab.types";
import Tab from "../tabs/tab/tab";
import TabNav from "../tabs/tabnav/tabnav";

import "./toolbox.scss"

interface ToolboxState {
    selectedTab: string;
    chipsLogic: ChipModel[];
    chipsInOut: ChipModel[];
    chipsCustom: ChipModel[];
}

interface ToolboxProps {
    onChipClicked: (chip: ChipModel) => void;
}

class Toolbox extends Component<ToolboxProps, ToolboxState> {
    private chipFactory: ChipFactory;


    constructor(props: ToolboxProps) {
        super(props);
        this.chipFactory = ChipFactory.getInstance();

        this.state = {
            selectedTab: 'chips-logic',
            chipsLogic: [
                // new ChipBlueprint("AND", "#729B79", [new ConnectorBlueprint("in1", ConnectorSide.Left, ConnectorDirection.SignalIn), new ConnectorBlueprint("in2", ConnectorSide.Left, ConnectorDirection.SignalIn), new ConnectorBlueprint("out1", ConnectorSide.Right, ConnectorDirection.SignalOut)]),
                new ChipModel("NOT", "#D05353", [new ConnectorModel("not_in1", ConnectorSide.Left, ConnectorDirection.SignalIn), new ConnectorModel("not_out1", ConnectorSide.Right, ConnectorDirection.SignalOut)])
            ],
            chipsInOut: [
                // new ChipBlueprint("Input", "#386FA4", [new ConnectorBlueprint("in1", ConnectorSide.Left, ConnectorDirection.SignalIn)]),
                new ChipModel("Output", "#386FA4", [new ConnectorModel("out_in1", ConnectorSide.Left, ConnectorDirection.SignalIn)]),
                new ChipModel("Constant On", "#6DA34D", [new ConnectorModel("on_out1", ConnectorSide.Right, ConnectorDirection.SignalOut)]),
                new ChipModel("Constant Off", "#D10000", [new ConnectorModel("off_out1", ConnectorSide.Right, ConnectorDirection.SignalOut)]),
                // new ChipBlueprint("Oscilloscope", "#000000", [new ConnectorBlueprint("in1", ConnectorSide.Left, ConnectorDirection.SignalIn)])
            ],
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