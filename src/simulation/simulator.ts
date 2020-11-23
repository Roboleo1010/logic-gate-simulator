import ChipFactory from "./ChipFactory";
import Gate from "./gate";
import { WireConnection, GateType, TriState } from "./simulator.types";

class Simulator {
    private static instance: Simulator;

    gates: Gate[] = [];
    wireConnections: WireConnection[] = []; //this is responsible for wiering external outputs to chip internal outputs

    evalsPerStep: number = 5;

    private constructor() {
        Simulator.instance = this;

        //on board only
        let in1 = new Gate("IN1", GateType.Controlled, TriState.True, []);
        let in2 = new Gate("IN2", GateType.Controlled, TriState.True, []);
        let out1 = new Gate("OUT1", GateType.Relay, TriState.False, []);

        this.gates.push(in1, in2, out1);

        let or = ChipFactory.getInstance().buildORChip(in1.id, in2.id);

        this.wireConnections.push({ outputId: "OUT1", input: or[0] });
    }

    public static getInstance() {
        if (!Simulator.instance)
            new Simulator();

        return Simulator.instance;
    }

    getGateById(id: string): Gate {
        return this.gates.filter(chip => chip.id === id)[0];
    }

    evaluate() {
        this.gates.forEach((gate: Gate) => {
            if (gate.type === GateType.Controlled)
                return;
            if (gate.type === GateType.Relay) {
                const inputA: Gate = this.getGateById(gate.inputs[0]);
                gate.state = inputA.state;
            }
            if (gate.type === GateType.AND) {
                const inputA: Gate = this.getGateById(gate.inputs[0]);
                const inputB: Gate = this.getGateById(gate.inputs[1]);

                if (inputA.state === TriState.Floating || inputB.state === TriState.Floating) gate.state = TriState.Floating;
                else if (inputA.state === TriState.True && inputB.state === TriState.True) gate.state = TriState.True
                else gate.state = TriState.False;
            }
            if (gate.type === GateType.NOT) {
                const inputA: Gate = this.getGateById(gate.inputs[0]);
                if (inputA.state === TriState.True) gate.state = TriState.False;
                else if (inputA.state === TriState.False) gate.state = TriState.True;
                else gate.state = TriState.Floating;
            }
        });
    }

    printState(gateIds: string[] = []) {

        if (gateIds.length > 0)
            this.gates.forEach(gate => {
                if (gateIds.indexOf(gate.id) >= 0)
                    console.log(`${gate.id} ${gate.state}`);
            });
        else
            this.gates.forEach(gate => {
                console.log(`${gate.id} ${gate.state}`);
            });
    }

    public simulate() {
        console.log(`Starting simulaton with ${this.gates.length} Gates`);

        this.wireConnections.forEach(config => {
            this.getGateById(config.outputId).inputs = [config.input];
        });

        for (let i = 0; i < this.evalsPerStep; i++)
            this.evaluate();

        this.printState(["IN1", "IN2", "OUT1"]);
    }
}

export default Simulator;