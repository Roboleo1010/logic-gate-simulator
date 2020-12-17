import Graph from '../utilities/graph/graph';
import { BlueprintType, ChipBlueprint, ChipCategory, Gate, GateRole, PinSide, SignalDirection } from '../model/circuit-builder.types';
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
            { id: "in", type: GateType.Relay, state: TriState.False, signalDirection: SignalDirection.In, name: 'In', isFirstLayer: true, pinSide: PinSide.Left },
            { id: "not", type: GateType.NOT, state: TriState.False, isFirstLayer: false },
            { id: "out", type: GateType.Relay, state: TriState.False, signalDirection: SignalDirection.Out, name: 'Out', isFirstLayer: true, pinSide: PinSide.Right }]);

        graphNOT.addEdges([{ from: "in", to: "not" }, { from: "not", to: "out" }])

        this.blueprints.push({ name: "NOT", color: "#007bff", category: ChipCategory.Logic, type: BlueprintType.Builtin, graph: graphNOT });

        //AND-Chip
        let graphAND = new Graph<Gate>();
        graphAND.addNodes([
            { id: "in1", type: GateType.Relay, state: TriState.False, signalDirection: SignalDirection.In, name: 'In 1', isFirstLayer: true, pinSide: PinSide.Left },
            { id: "in2", type: GateType.Relay, state: TriState.False, signalDirection: SignalDirection.In, name: 'In 2', isFirstLayer: true, pinSide: PinSide.Left },
            { id: "and", type: GateType.AND, state: TriState.False, isFirstLayer: false },
            { id: "out", type: GateType.Relay, state: TriState.False, signalDirection: SignalDirection.Out, name: 'Out', isFirstLayer: true, pinSide: PinSide.Right }])

        graphAND.addEdges([{ from: "in1", to: "and" }, { from: "in2", to: "and" }, { from: "and", to: "out" }]);

        this.blueprints.push({ name: "AND", color: "#e83e8c", category: ChipCategory.Logic, type: BlueprintType.Builtin, graph: graphAND });

        //INPUT-Chip
        let graphInput = new Graph<Gate>();
        graphInput.addNodes([{ id: "switch", type: GateType.Controlled, state: TriState.False, signalDirection: SignalDirection.Out, role: GateRole.Switch, name: 'In', isFirstLayer: true, pinSide: PinSide.Right }]);

        this.blueprints.push({ name: "Input", color: "#fd7e14", category: ChipCategory.Io, graph: graphInput, type: BlueprintType.Builtin, description: "Click this switch to toggle it's state. Gets converted to Chip Input after Packaging" });

        //OUTPUT-Chip
        let graphOutput = new Graph<Gate>();
        graphOutput.addNodes([{ id: "out", type: GateType.Relay, state: TriState.False, signalDirection: SignalDirection.In, role: GateRole.Output, name: 'Out', isFirstLayer: true, pinSide: PinSide.Left }]);

        this.blueprints.push({ name: "Output", color: "#fd7e14", category: ChipCategory.Io, graph: graphOutput, type: BlueprintType.Builtin, description: "Gets converted to Chip Output after Packaging" });

        //CLOCK-Chip
        let graphClock = new Graph<Gate>();
        graphClock.addNodes([{ id: "clock", type: GateType.Controlled, state: TriState.False, signalDirection: SignalDirection.Out, role: GateRole.Clock, name: 'Clock', isFirstLayer: true, pinSide: PinSide.Right }]);

        this.blueprints.push({ name: "Clock", color: "#20c997", category: ChipCategory.Io, graph: graphClock, type: BlueprintType.Builtin, description: "Gets converted to Chip Input after Packaging." });

        //CONSTANT-ON
        let graphConstantOn = new Graph<Gate>();
        graphConstantOn.addNodes([
            { id: "out", type: GateType.Controlled, state: TriState.True, signalDirection: SignalDirection.Out, name: 'Out', isFirstLayer: true, pinSide: PinSide.Right }]);

        this.blueprints.push({ name: "Constant On", color: "#28a745", category: ChipCategory.Io, type: BlueprintType.Builtin, graph: graphConstantOn });

        //CONSTANT-OFF
        let graphConstantOff = new Graph<Gate>();
        graphConstantOff.addNodes([
            { id: "out", type: GateType.Controlled, state: TriState.False, signalDirection: SignalDirection.Out, name: 'Out', isFirstLayer: true, pinSide: PinSide.Right }]);

        this.blueprints.push({ name: "Constant Off", color: "#dc3545", category: ChipCategory.Io, type: BlueprintType.Builtin, graph: graphConstantOff });
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