import ChipBlueprint from '../../model/chip-blueprint';
import ChipToolbox from '../chip/chip-toolbox';
import React, { Component } from 'react';
import Tab from '../tabs/tab/tab';
import TabNav from '../tabs/tabnav/tabnav';
import { TabData } from '../tabs/tab.types';
import './toolbox.scss';

interface ToolboxState {
    selectedTab: string;
}

interface ToolboxProps {
    onChipClicked: (chip: ChipBlueprint, position: { x: number, y: number }) => void;
    blueprints: ChipBlueprint[]
}

class Toolbox extends Component<ToolboxProps, ToolboxState> {
    constructor(props: ToolboxProps) {
        super(props);

        this.state = { selectedTab: 'chips-logic' };
    }

    setSelected(tab: TabData) {
        this.setState({ selectedTab: tab.id });
    }

    render() {
        const tabs: TabData[] = [{ id: 'chips-logic', name: 'Chips (Logic)' }, { id: 'chips-io', name: 'Chips (In/ Out)' }, { id: 'chips-custom', name: 'Chips (Custom)' }];

        return (
            <div className="toolbox">
                <TabNav tabs={tabs} selectedId={this.state.selectedTab} setSelected={this.setSelected.bind(this)}>
                    <Tab isSelected={this.state.selectedTab === tabs[0].id}>
                        <div className="tab-chips">
                            {this.props.blueprints.filter(blueprint => blueprint.category === 'logic').map(chip => {
                                return <ChipToolbox blueprint={chip} key={chip.name} onChipClicked={this.props.onChipClicked}></ChipToolbox>;
                            })}
                        </div>
                    </Tab>
                    <Tab isSelected={this.state.selectedTab === tabs[1].id}>
                        <div className="tab-chips">
                            {this.props.blueprints.filter(blueprint => blueprint.category === 'io').map(chip => {
                                return <ChipToolbox blueprint={chip} key={chip.name} onChipClicked={this.props.onChipClicked}></ChipToolbox>;
                            })}
                        </div>
                    </Tab>
                    <Tab isSelected={this.state.selectedTab === tabs[2].id}>
                        <div className="tab-chips">
                            {this.props.blueprints.filter(blueprint => blueprint.category === 'custom').map(chip => {
                                return <ChipToolbox blueprint={chip} key={chip.name} onChipClicked={this.props.onChipClicked}></ChipToolbox>;
                            })}
                        </div>
                    </Tab>
                </TabNav>
            </div>
        );
    }
}

export default Toolbox;