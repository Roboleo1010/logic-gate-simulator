import Gate from "../gate";
import Edge from "../graph/edge";
import Chip from "./chip";
import Chiplet from "./chiplet";
import { GateType, TriState } from "../simulator.types";
import { ChipletType } from "./chip.types";

class ChipFactory {

    public buildANDChip(id: string, topLevelIn1?: string, topLevelIn2?: string): Chip {
        let chip = new Chip(id, "AND", "AND", "#4a4a4a");

        let in1 = new Chiplet("AND_IN1", ChipletType.Relay, topLevelIn1);
        let in2 = new Chiplet("AND_IN2", ChipletType.Relay, topLevelIn2);

        let and1 = new Chiplet("AND_AND1", ChipletType.GateAND);

        let out1 = new Chiplet("AND_OUT1", ChipletType.Relay);

        let edges: Edge[] = [
            { from: in1.id, to: and1.id },
            { from: in2.id, to: and1.id },
            { from: and1.id, to: out1.id },
        ];

        chip.graph.addNodes([in1, in2, and1, out1]);
        chip.graph.addEdges(edges);

        return chip;
    }

    public buildNANDChip(id: string, topLevelIn1?: string, topLevelIn2?: string): Chip {
        let chip = new Chip(id, "NAND", "NAND", "#565656");

        let in1 = new Chiplet("NAND_IN1", ChipletType.Relay, topLevelIn1);
        let in2 = new Chiplet("NAND_IN2", ChipletType.Relay, topLevelIn2);

        let and1 = this.buildANDChip("");
        let not1 = new Chiplet("NAND_NOT1", ChipletType.GateNOT);

        let out1 = new Chiplet("NAND_OUT1", ChipletType.Relay);

        let edges: Edge[] = [
            { from: in1.id, to: and1.graph.getNodeById("AND_IN1").id },
            { from: in2.id, to: and1.graph.getNodeById("AND_IN2").id },
            { from: and1.graph.getNodeById("AND_OUT1").id, to: not1.id },
            { from: not1.id, to: out1.id }
        ];

        chip.graph.addNodes([in1, in2, and1, not1, out1, ...and1.graph.nodes]);
        chip.graph.addEdges([...edges, ...and1.graph.edges]);

        console.log(chip);

        return chip;
    }

    public buildORChip(id: string, topLevelIn1?: string, topLevelIn2?: string): Chip {
        let chip: Chip = new Chip(id, "OR", "OR", "#5d5d5d");

        let in1 = new Chiplet("OR_IN1", ChipletType.Relay, topLevelIn1);
        let in2 = new Chiplet("OR_IN2", ChipletType.Relay, topLevelIn2);

        let not1 = new Chiplet("OR_NOT1", ChipletType.GateNOT);
        let not2 = new Chiplet("OR_NOT2", ChipletType.GateNOT);

        let nand1 = this.buildNANDChip("");

        let out1 = new Chiplet("OR_OUT1", ChipletType.Relay);

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
            let type: GateType;

            switch (chiplet.type) { //TODO: use gateType in chiplet if possible
                case ChipletType.GateAND:
                    type = GateType.AND;
                    break;
                case ChipletType.GateNOT:
                    type = GateType.NOT;
                    break;
                case ChipletType.Relay:
                    type = GateType.Relay;
                    break;
                case ChipletType.Chip:
                    return;
            }

            gates.push(new Gate(chiplet.id, type, TriState.False, [...chip.graph.getEdgesPointingTo(chiplet.id), chiplet.extraInputs]));
        });

        return gates;
    }
}

export default ChipFactory;