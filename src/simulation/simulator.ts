import Gate from "./gate";
import { GateType, TriState } from "./simulator.types";

class Simulator {
    gates: Gate[] = [
        new Gate('in1', GateType.Controlled, TriState.True, []),
        new Gate('in2', GateType.Controlled, TriState.True, []),
        new Gate('in3', GateType.Controlled, TriState.False, []),
        new Gate('and1', GateType.And, TriState.False, ['in1', 'in2']),
        new Gate('and2', GateType.And, TriState.False, ['in2', 'in3']),
    ];

    evalsPerStep: number = 5;

    getGateById(id: string): Gate {
        return this.gates.filter(chip => chip.id === id)[0];
    }

    evaluate() {
        this.gates.forEach((gate: Gate) => {
            if (gate.type === GateType.Controlled)
                return;
            if (gate.type === GateType.And) {
                const inputA: Gate = this.getGateById(gate.inputs[0]);
                const inputB: Gate = this.getGateById(gate.inputs[1]);

                if (inputA.state === TriState.Floating || inputB.state === TriState.Floating) gate.state = TriState.Floating;
                else if (inputA.state === TriState.True && inputB.state === TriState.True) gate.state = TriState.True
                else gate.state = TriState.False;
            }
            if (gate.type === GateType.Not) {
                const inputA: Gate = this.getGateById(gate.inputs[0]);
                if (inputA.state === TriState.True) gate.state = TriState.False;
                else if (inputA.state === TriState.False) gate.state = TriState.True;
                else gate.state = TriState.Floating;
            }
        });
    }

    printState() {
        this.gates.forEach(chip => {
            console.log(`${chip.id} ${chip.state}`);
        })
    }

    public simulate() {
        console.log("Starting Simulaton");

        for (let i = 0; i < this.evalsPerStep; i++)
            this.evaluate();

        this.printState();
    }
}

export default Simulator;