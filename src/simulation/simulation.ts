import { Gate, GateType, SimulationResult } from './simulator.types';

class Simulation {
    private gates: Gate[] = [];
    private result: SimulationResult;

    evalsPerTick: number = 100;

    constructor(gates: Gate[]) {
        this.gates = gates;
        this.result = { states: [], time: 0, gates: this.gates };
    }

    public simulate(): SimulationResult {
        const timerStart = performance.now();

        for (let i = 0; i < this.evalsPerTick; i++)
            this.evaluate();

        this.result.states = this.gates.map(gate => { return { id: gate.id, state: gate.state } });
        this.result.time = performance.now() - timerStart;

        return this.result;
    }

    private getGateById(id: string): Gate {
        return this.gates.filter(gate => gate.id === id)[0];
    }

    private evaluate() {
        this.gates.forEach((gate: Gate) => {
            //0 Inputs
            if (gate.type === GateType.Controlled)
                return;

            //1 Inputs
            const inputA: boolean = this.getGateById(gate.inputs[0]).state;

            if (gate.type === GateType.Relay) {
                gate.state = inputA;
                return;
            }
            if (gate.type === GateType.NOT) {
                gate.state = !inputA;
                return;
            }

            //2 Inputs
            const inputB: boolean = this.getGateById(gate.inputs[1]).state;

            if (gate.type === GateType.AND) {
                gate.state = inputA && inputB;
                return;
            }
            if (gate.type === GateType.NAND) {
                gate.state = !(inputA && inputB);
                return;
            }
            if (gate.type === GateType.OR) {
                gate.state = inputA || inputB;
                return;
            }
            if (gate.type === GateType.NOR) {
                gate.state = !(inputA || inputB);
                return;
            }
            if (gate.type === GateType.XOR) {
                gate.state = inputA !== inputB;
                return;
            }
            if (gate.type === GateType.XNOR) {
                gate.state = !(inputA !== inputB);
                return;
            }
        });
    }
}

export default Simulation;