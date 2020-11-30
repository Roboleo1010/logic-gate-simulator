import { GateType, TriState } from "./simulator.types";
import Gate from "./gate";
import Simulation from "./simulation";

class ChipFactory {
    private static instance: ChipFactory;

    private nextANDId: number = 0;
    private nextNOTId: number = 0;

    private simulation: Simulation;

    private constructor() {
        ChipFactory.instance = this;
        this.simulation = Simulation.getInstance();
    }

    public static getInstance() {
        if (!ChipFactory.instance)
            new ChipFactory();

        return ChipFactory.instance;
    }

    public buildANDChip(in1: string, in2: string): string[] {
        let id = `AND_${this.nextANDId++}`;
        let and = new Gate(id, GateType.AND, TriState.False, [in1, in2]);

        this.simulation.addGates([and]);

        return [id];
    }

    public buildNOTChip(in1: string): string[] {
        let id = `NOT_${this.nextNOTId++}`;
        let not = new Gate(id, GateType.NOT, TriState.False, [in1]);

        this.simulation.addGates([not]);

        return [id];
    }

    public buildNANDChip(in1: string, in2: string): string[] {
        let and = this.buildANDChip(in1, in2);
        let not = this.buildNOTChip(and[0]);

        return not;
    }

    public buildORChip(in1: string, in2: string): string[] {

        let not1 = this.buildNOTChip(in1);
        let not2 = this.buildNOTChip(in2);

        let nand1 = this.buildNANDChip(not1[0], not2[0]);

        return nand1;
    }
}
export default ChipFactory;