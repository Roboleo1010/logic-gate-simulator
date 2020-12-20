import ChipToolbox from '../chip/chip-toolbox';
import React, { Component } from 'react';
import Tab from '../tabs/tab/tab';
import TabNav from '../tabs/tabnav/tabnav';
import { ChipBlueprint, ChipCategory, Vector2 } from '../../model/circuit-builder.types';
import { TabData } from '../tabs/tab.types';
import './toolbox.scss';

interface ToolboxState {
    selectedTab: string;
}

interface ToolboxProps {
    onChipClicked: (chip: ChipBlueprint, position: Vector2) => void;
    blueprints: ChipBlueprint[]
}

class Toolbox extends Component<ToolboxProps, ToolboxState> {
    constructor(props: ToolboxProps) {
        super(props);

        this.state = { selectedTab: ChipCategory.Io };
    }

    setSelected(tab: TabData) {
        this.setState({ selectedTab: tab.id });
    }

    render() {
        let tabs: TabData[] = [];

        Object.keys(ChipCategory).forEach(category =>
            tabs.push({ id: category, name: `Chips (${category})` })
        );

        return (
            <div className="toolbox">
                <TabNav tabs={tabs} selectedId={this.state.selectedTab} setSelected={this.setSelected.bind(this)}>
                    {tabs.map(tab => {
                        return (
                            <Tab isSelected={this.state.selectedTab === tab.id} key={tab.id}>
                                <div className="tab-chips">
                                    {
                                        this.props.blueprints.filter(blueprint => blueprint.category === tab.id).map(chip => {
                                            return <ChipToolbox blueprint={chip} key={chip.name} onChipClicked={this.props.onChipClicked}></ChipToolbox>;
                                        })}
                                </div>
                            </Tab>)
                    })}
                </TabNav>
            </div>
        );
    }
}

export default Toolbox;