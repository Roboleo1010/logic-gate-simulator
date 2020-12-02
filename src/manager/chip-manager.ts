import { ChipBlueprint } from "../model/circuit-builder.types";
import { GateFunction, GateType, TriState } from "../simulation/simulator.types";

class ChipManager {
    private chips: Map<string, ChipBlueprint> = new Map();
    private chipIds: Map<string, number> = new Map();

    private nextId: number = 0;

    private static instance: ChipManager;

    private constructor() {
        ChipManager.instance = this;

        this.loadData();
    }

    private loadData() {//TODO: From Firebase
        // Logic
        this.chips.set("Not", {
            name: "NOT", color: "#e76f51", category: "logic", gates: [
                { id: 'rly_in', type: GateType.Relay, state: TriState.False, inputs: [] },
                { id: 'not', type: GateType.NOT, state: TriState.False, inputs: ['rly_in'] },
                { id: 'rly_out', type: GateType.Relay, state: TriState.False, inputs: ['not'] }]
        });
        this.chips.set("And", {
            name: "AND", color: "#2a9d8f", category: "logic", gates: [
                { id: 'rly_in1', type: GateType.Relay, state: TriState.False, inputs: [] },
                { id: 'rly_in2', type: GateType.Relay, state: TriState.False, inputs: [] },
                { id: 'and', type: GateType.AND, state: TriState.False, inputs: ['rly_in1', 'rly_in2'] },
                { id: 'rly_out', type: GateType.Relay, state: TriState.False, inputs: ['and'] }]
        });

        //IO
        this.chips.set("Constant On", {
            name: "Constant On", color: "#6DA34D", category: "io", description: "Emits a constant ON signal", gates: [
                { id: 'ctr', type: GateType.Controlled, state: TriState.True, inputs: [] },
                { id: 'rly_out', type: GateType.Relay, state: TriState.False, inputs: ['ctr'] }]
        });
        this.chips.set("Constant Off", {
            name: "Constant Off", color: "#D10000", category: "io", description: "Emits a constant OFF signal", gates: [
                { id: 'ctr', type: GateType.Controlled, state: TriState.False, inputs: [] },
                { id: 'rly_out', type: GateType.Relay, state: TriState.False, inputs: ['ctr'] }]
        });
        this.chips.set("Switch", {
            name: "Switch", color: "#FE5F00", category: "io", description: "Can be clicked to toggle state while Simulation is running", gates: [
                { id: 'ctr', type: GateType.Controlled, function: GateFunction.Switch, state: TriState.False, inputs: [] },
                { id: 'rly_out', type: GateType.Relay, state: TriState.False, inputs: ['ctr'] }]
        });

        this.chips.set("Clock", {
            name: "Clock", color: "#FBB02D", category: "io", description: "Switches state every simulation Tick", gates: [
                { id: 'ctr', type: GateType.Controlled, function: GateFunction.Clock, state: TriState.False, inputs: [] },
                { id: 'rly_out', type: GateType.Relay, state: TriState.False, inputs: ['ctr'] }]
        });
        this.chips.set("Output", {
            name: "Output", color: "#912F56", category: "io", description: "Displays a connected State", gates: [
                { id: 'rly_in', type: GateType.Relay, function: GateFunction.Output, state: TriState.False, inputs: [] }]
        });
    }

    public static getInstance() {
        if (!ChipManager.instance)
            new ChipManager();

        return ChipManager.instance;
    }

    public getChip(name: string) {
        if (this.chips.has(name))
            return this.chips.get(name);

        return "";
    }

    public getByCategory(category: string): ChipBlueprint[] {
        let chips: ChipBlueprint[] = [];

        if (category)
            this.chips.forEach(chip => {
                if (chip.category === category)
                    chips.push(chip);
            });
        else
            this.chips.forEach(chip => {
                if (chip.category === undefined)
                    chips.push(chip);
            });

        return chips;
    }

    public getNextChipId(name: string): number {
        if (!this.chipIds.has(name)) {
            this.chipIds.set(name, 0);
            return 0;
        }

        let id = this.chipIds.get(name);

        if (id !== undefined) {
            id++;
            this.chipIds.set(name, id);
            return id;
        }

        console.error("Error while getting new ChipId");
        return -1;
    }

    public getNextId(): string {
        return `${this.nextId++}`;
    }

}

export default ChipManager;