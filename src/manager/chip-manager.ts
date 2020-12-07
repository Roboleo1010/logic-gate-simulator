import ChipBlueprint from '../model/chip-blueprint';
import Graph from '../utilities/graph/graph';
import { Gate, GateRole } from '../model/circuit-builder.types';
import { GateType, TriState } from '../simulation/simulator.types';

class ChipManager {
    private static instance: ChipManager;
    private blueprints: ChipBlueprint[];
    private chipIds: Map<string, number>;

    private constructor() {
        ChipManager.instance = this;
        this.blueprints = [];
        this.chipIds = new Map();

        this.loadData();
    }

    public static getInstance() {
        if (!ChipManager.instance)
            new ChipManager();

        return ChipManager.instance;
    }

    private loadData() {//TODO: From Firebase    
        //NOT-Gate 
        let graphNOT = new Graph<Gate>();
        graphNOT.addNodes([
            { id: "in1", type: GateType.Relay, state: TriState.False, role: GateRole.Input },
            { id: "not", type: GateType.NOT, state: TriState.False },
            { id: "out1", type: GateType.Relay, state: TriState.False, role: GateRole.Output }])

        graphNOT.addEdges([{ from: "in1", to: "not" }, { from: "not", to: "out1" }])

        this.blueprints.push(new ChipBlueprint("NOT", "#e76f51", "logic", graphNOT));

        //AND-Gate
        let graphAND = new Graph<Gate>();
        graphAND.addNodes([
            { id: "in1", type: GateType.Relay, state: TriState.False, role: GateRole.Input },
            { id: "in2", type: GateType.Relay, state: TriState.False, role: GateRole.Input },
            { id: "and", type: GateType.AND, state: TriState.False },
            { id: "out1", type: GateType.Relay, state: TriState.False, role: GateRole.Output }])

        graphAND.addEdges([{ from: "in1", to: "and" }, { from: "in2", to: "and" }, { from: "and", to: "out1" }])

        this.blueprints.push(new ChipBlueprint("AND", "#2a9d8f", "logic", graphAND));

        //INPUT-Gate
        let graphInput = new Graph<Gate>();
        graphInput.addNodes([{
            id: "in1", type: GateType.Controlled, state: TriState.False, role: GateRole.Output
        }])

        this.blueprints.push(new ChipBlueprint("Input (Switch)", "#FE5F00", "io", graphInput, "Can be clicked to toggle state while Simulation is running"));

        //OUTPUT-Gate
        let graphOutput = new Graph<Gate>();
        graphOutput.addNodes([{ id: "out1", type: GateType.Relay, state: TriState.False, role: GateRole.Input }])

        this.blueprints.push(new ChipBlueprint("Output", "#912F56", "io", graphOutput, "Displays a connected State"));
    }

    public static getBlueprints(): ChipBlueprint[] {
        return ChipManager.getInstance().blueprints;
    }

    public static getChipId(name: string): number {
        let instance = ChipManager.getInstance();
        if (!instance.chipIds.has(name)) {
            instance.chipIds.set(name, 0);
            return 0;
        }

        let id = instance.chipIds.get(name)!;

        id++;
        instance.chipIds.set(name, id);
        return id;
    }
}

export default ChipManager;