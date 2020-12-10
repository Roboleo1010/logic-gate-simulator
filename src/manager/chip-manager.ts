import ChipBlueprint from '../model/chip-blueprint';
import Graph from '../utilities/graph/graph';
import { Gate, GateRole, SignalDirection } from '../model/circuit-builder.types';
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
        //NOT-Chip 
        let graphNOT = new Graph<Gate>();
        graphNOT.addNodes([
            { id: "in", type: GateType.Relay, state: TriState.False, signalDirection: SignalDirection.In, name: 'In' },
            { id: "not", type: GateType.NOT, state: TriState.False },
            { id: "out", type: GateType.Relay, state: TriState.False, signalDirection: SignalDirection.Out, name: 'Out' }]);

        graphNOT.addEdges([{ from: "in", to: "not" }, { from: "not", to: "out" }])

        this.blueprints.push(new ChipBlueprint("NOT", "#e76f51", "logic", graphNOT));

        //AND-Chip
        let graphAND = new Graph<Gate>();
        graphAND.addNodes([
            { id: "in1", type: GateType.Relay, state: TriState.False, signalDirection: SignalDirection.In, name: 'In 1' },
            { id: "in2", type: GateType.Relay, state: TriState.False, signalDirection: SignalDirection.In, name: 'In 2' },
            { id: "and", type: GateType.AND, state: TriState.False },
            { id: "out", type: GateType.Relay, state: TriState.False, signalDirection: SignalDirection.Out, name: 'Out' }])

        graphAND.addEdges([{ from: "in1", to: "and" }, { from: "in2", to: "and" }, { from: "and", to: "out" }]);

        this.blueprints.push(new ChipBlueprint("AND", "#2a9d8f", "logic", graphAND));

        //INPUT-Chip
        let graphInput = new Graph<Gate>();
        graphInput.addNodes([{ id: "switch", type: GateType.Controlled, state: TriState.False, signalDirection: SignalDirection.Out, role: GateRole.Switch, name: 'In' }]);

        this.blueprints.push(new ChipBlueprint("Input", "#FE5F00", "io", graphInput));

        //CLOCK-Chip
        // let graphClock = new Graph<Gate>();
        // graphClock.addNodes([
        //     { id: "clock", type: GateType.Controlled, state: TriState.False, signalDirection: SignalDirection.In, role: GateRole.Clock, name: 'Clock', hidden: true },
        //     { id: "out", type: GateType.Relay, state: TriState.False, signalDirection: SignalDirection.Out, name: 'Clock' }]);

        // graphClock.addEdges([{ from: "clock", to: "out" }]);

        // this.blueprints.push(new ChipBlueprint("Clock", "#FE5F00", "io", graphClock));

        //CONSTANT-ON
        let graphConstantOn = new Graph<Gate>();
        graphConstantOn.addNodes([
            { id: "out", type: GateType.Controlled, state: TriState.True, signalDirection: SignalDirection.Out, name: 'Out' }]);

        this.blueprints.push(new ChipBlueprint("Constant On", "#FE5F00", "io", graphConstantOn));

        //CONSTANT-OFF
        let graphConstantOff = new Graph<Gate>();
        graphConstantOff.addNodes([
            { id: "out", type: GateType.Controlled, state: TriState.False, signalDirection: SignalDirection.Out, name: 'Out' }]);

        this.blueprints.push(new ChipBlueprint("Constant Off", "#FE5F00", "io", graphConstantOff));

        //OUTPUT-Chip
        let graphOutput = new Graph<Gate>();
        graphOutput.addNodes([{ id: "out", type: GateType.Relay, state: TriState.False, signalDirection: SignalDirection.In, role: GateRole.Output, name: 'Out' }]);

        this.blueprints.push(new ChipBlueprint("Output", "#FE5F00", "io", graphOutput));
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