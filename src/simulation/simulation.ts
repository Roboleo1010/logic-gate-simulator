import ChipFactory from "./ChipFactory";
import Gate from "./gate";
import { GateType, TriState } from "./simulator.types";
import { Wire } from "./wire";

class Simulation {
    private static instance: Simulation;

    private gates: Gate[] = [];
    private wires: Wire[] = []; //this is responsible for wiering external outputs to chip internal outputs

    evalsPerStep: number = 5;

    private constructor() {
        Simulation.instance = this;

        //on board only
        let in1 = new Gate("IN1", GateType.Controlled, TriState.True, []);
        let in2 = new Gate("IN2", GateType.Controlled, TriState.True, []);
        let out1 = new Gate("OUT1", GateType.Relay, TriState.False, []);

        this.gates.push(in1, in2, out1);

        let or = ChipFactory.getInstance().buildANDChip(in1.id, in2.id);

        this.wires.push({ inputId: or[0], outputId: "OUT1" });
    }

    public static getInstance() {
        if (!Simulation.instance)
            new Simulation();

        return Simulation.instance;
    }

    public addGates(gates: Gate[]) {
        this.gates.push(...gates);
    }

    public addWires(connections: Wire[]) {
        this.wires.push(...connections);
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

        this.wires.forEach(wire => {
            this.getGateById(wire.outputId).inputs = [wire.inputId];
        });

        for (let i = 0; i < this.evalsPerStep; i++)
            this.evaluate();

        this.printState(["IN1", "IN2", "OUT1"]);
    }
}

export default Simulation;