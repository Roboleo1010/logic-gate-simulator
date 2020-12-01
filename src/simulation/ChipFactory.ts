import { GateType, TriState, Gate } from "./simulator.types";

class ChipFactory {
    private nextANDId: number = 0;
    private nextNOTId: number = 0;

    gates: Gate[] = [];

    public buildANDChip(in1: string, in2: string): string[] {
        let id = `AND_${this.nextANDId++}`;
        let and: Gate = { id: id, type: GateType.AND, state: TriState.False, inputs: [in1, in2] };

        this.gates.push(and);

        return [id];
    }

    public buildNOTChip(in1: string): string[] {
        let id = `NOT_${this.nextNOTId++}`;
        let not: Gate = { id: id, type: GateType.NOT, state: TriState.False, inputs: [in1] };

        this.gates.push(not);

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