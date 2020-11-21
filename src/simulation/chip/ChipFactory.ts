import Gate from "../gate";
import { GateType, TriState } from "../simulator.types";
import Chip from "./chip";

class ChipFactory {

    public buildNANDChip(id: string, in1: string, in2: string, out1: string) {
        let chip = new Chip(id, "NAND", "NAND", "#565656");

        chip.graph.addNode(this.buildANDGate(`AND1`, [in1, in2]));
        chip.graph.addNode(this.buildNOTGate(out1, [`AND1`]));

        return chip;
    }

    public buildORChip(id: string, in1: string, in2: string, out1: string): Chip {
        let chipOR: Chip = new Chip(id, "OR", "OR", "#5d5d5d");

        chipOR.graph.addNodes([this.buildNOTGate(`NOT1`, [in1]), this.buildNOTGate(`NOT2`, [in2])]);
        chipOR.graph.addNodes(this.buildNANDChip(id, `NOT1`, `NOT2`, out1).graph.nodes);

        console.log(chipOR);

        return chipOR;
    }

    private buildANDGate(id: string, inputs: string[]): Gate {
        return new Gate(id, GateType.And, TriState.False, inputs);
    }

    private buildNOTGate(id: string, inputs: string[]): Gate {
        return new Gate(id, GateType.Not, TriState.False, inputs);
    }

    private buildInput(id: string, state: TriState): Gate {
        return new Gate(id, GateType.Controlled, state, []);
    }
}

export default ChipFactory;