import Gate from "../gate";
import Edge from "../../utility/graph/edge";
import Chip from "./chip";
import Chiplet from "./chiplet";
import { GateType, TriState } from "../simulator.types";

class ChipFactory {

    public buildANDChip(id: string, topLevelIn1?: string, topLevelIn2?: string): Chip {
        let chip = new Chip(id);

        let in1 = new Chiplet("AND_IN1", GateType.Relay, topLevelIn1);
        let in2 = new Chiplet("AND_IN2", GateType.Relay, topLevelIn2);

        let and1 = new Chiplet("AND_AND1", GateType.AND);

        let out1 = new Chiplet("AND_OUT1", GateType.Relay);

        let edges: Edge[] = [
            { from: in1.id, to: and1.id },
            { from: in2.id, to: and1.id },
            { from: and1.id, to: out1.id },
        ];

        chip.graph.addNodes([in1, in2, and1, out1]);
        chip.graph.addEdges(edges);

        return chip;
    }

    public buildNOTChip(id: string, topLevelIn1?: string): Chip {
        let chip = new Chip(id);

        let in1 = new Chiplet("NOT_IN1", GateType.Relay, topLevelIn1);

        let not1 = new Chiplet("NOT_NOT1", GateType.NOT);

        let out1 = new Chiplet("NOT_OUT1", GateType.Relay);

        let edges: Edge[] = [
            { from: in1.id, to: not1.id },
            { from: not1.id, to: out1.id },
        ];

        chip.graph.addNodes([in1, not1, out1]);
        chip.graph.addEdges(edges);

        return chip;
    }

    public buildNANDChip(id: string, topLevelIn1?: string, topLevelIn2?: string): Chip {
        let chip = new Chip(id);

        let in1 = new Chiplet("NAND_IN1", GateType.Relay, topLevelIn1);
        let in2 = new Chiplet("NAND_IN2", GateType.Relay, topLevelIn2);

        let and1 = this.buildANDChip("");
        let not1 = this.buildNOTChip("");

        let out1 = new Chiplet("NAND_OUT1", GateType.Relay);

        let edges: Edge[] = [
            { from: in1.id, to: and1.graph.getNodeById("AND_IN1").id },
            { from: in2.id, to: and1.graph.getNodeById("AND_IN2").id },
            { from: and1.graph.getNodeById("AND_OUT1").id, to: not1.graph.getNodeById("NOT_IN1").id },
            { from: not1.graph.getNodeById("NOT_OUT1").id, to: out1.id }
        ];

        chip.graph.addNodes([in1, in2, out1, ...not1.graph.nodes, ...and1.graph.nodes]);
        chip.graph.addEdges([...edges, ...and1.graph.edges, ...not1.graph.edges]);

        return chip;
    }

    public buildORChip(id: string, topLevelIn1?: string, topLevelIn2?: string): Chip {
        let chip: Chip = new Chip(id);

        let in1 = new Chiplet("OR_IN1", GateType.Relay, topLevelIn1);
        let in2 = new Chiplet("OR_IN2", GateType.Relay, topLevelIn2);

        let not1 = new Chiplet("OR_NOT1", GateType.NOT);
        let not2 = new Chiplet("OR_NOT2", GateType.NOT);

        let nand1 = this.buildNANDChip("");

        let out1 = new Chiplet("OR_OUT1", GateType.Relay);

        let edges: Edge[] = [

            { from: in1.id, to: not1.id },
            { from: in2.id, to: not2.id },
            { from: not1.id, to: nand1.graph.getNodeById("NAND_IN1").id },
            { from: not2.id, to: nand1.graph.getNodeById("NAND_IN2").id },
            { from: nand1.graph.getNodeById("NAND_OUT1").id, to: out1.id }
        ];

        chip.graph.addNodes([in1, in2, not1, not2, out1, ...nand1.graph.nodes]);
        chip.graph.addEdges([...edges, ...nand1.graph.edges]);

        return chip;
    }

    public getGates(chip: Chip): Gate[] {
        let gates: Gate[] = [];

        chip.graph.nodes.forEach(chiplet => {
            gates.push(new Gate(chiplet.id, chiplet.type, TriState.False, [...chip.graph.getEdgesPointingTo(chiplet.id), chiplet.extraInputs]));
        });

        return gates;
    }
}

export default ChipFactory;