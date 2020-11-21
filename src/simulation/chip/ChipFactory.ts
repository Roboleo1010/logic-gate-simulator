import Gate from "../gate";
import { GateType, TriState } from "../simulator.types";
import Chip from "./chip";

class ChipFactory {

    constructor() {
        this.buildOrChip();
    }

    public buildOrChip(): Chip {
        let or: Chip = new Chip("OR", "OR", "#5d5d5d");

        or.graph.addNodes([this.buildInput("IN1", TriState.False), this.buildInput("IN2", TriState.False)]);
        or.graph.addNodes([this.buildNOTGate("NOT1", ["IN1"]), this.buildNOTGate("NOT2", ["IN2"])]);
        or.graph.addNode(this.buildANDGate("AND1", ["NOT1", "NOT2"]));
        or.graph.addNode(this.buildNOTGate("NOT3", ["AND1"]));

        or.graph.addEdges([{ from: "IN1", to: "NOT1" }, { from: "IN2", to: "NOT2" }])
        or.graph.addEdges([{ from: "NOT1", to: "AND1" }, { from: "NOT2", to: "AND1" }])
        or.graph.addEdge({ from: "AND1", to: "NOT3" });

        console.log(or);

        return or;
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