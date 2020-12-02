import { GateType, TriState, Wire, Gate, SimulationResult } from "./simulator.types";

class Simulation {
    private gates: Gate[] = [];
    private wires: Wire[] = [];

    private result: SimulationResult;

    evalsPerTick: number = 10;

    constructor(gates: Gate[], wires: Wire[]) {
        this.gates = gates;
        this.wires = wires;

        this.wires.forEach(wire => {
            this.getGateById(wire.outputId).inputs = [wire.inputId];
        });

        this.result = { states: [], time: 0, gates: this.gates, wires: this.wires, error: false, missingConnections: [] };
    }


    public simulate(): SimulationResult {
        const timerStart = performance.now();

        //Switch clocks
        this.gates.filter(gate => gate.type === GateType.Clock).forEach(clock => clock.state === TriState.True ? clock.state = TriState.False : clock.state = TriState.True);

        for (let i = 0; i < this.evalsPerTick; i++)
            this.evaluate();

        if (this.result.missingConnections.length === 0)
            this.result.states = this.gates.map(gate => { return { id: gate.id, state: gate.state } });
        else {
            this.result.missingConnections = [...new Set(this.result.missingConnections)]
            this.result.error = true;
        }

        this.result.time = performance.now() - timerStart;

        return this.result;
    }

    public changeGateState(id: string, state: TriState) {
        this.getGateById(id).state = state;
    }

    private getGateById(id: string): Gate {
        return this.gates.filter(chip => chip.id === id)[0];
    }

    private evaluate() {
        this.gates.forEach((gate: Gate) => {
            if (gate.type === GateType.Controlled || gate.type === GateType.Clock || gate.type === GateType.Switch)
                return;
            if (gate.type === GateType.Relay || gate.type === GateType.Output) {
                const inputA: Gate = this.getGateById(gate.inputs[0]);

                if (!inputA) {
                    this.result.missingConnections.push(gate.id);
                    return;
                }

                gate.state = inputA.state;
            }
            if (gate.type === GateType.AND) {
                const inputA: Gate = this.getGateById(gate.inputs[0]);
                const inputB: Gate = this.getGateById(gate.inputs[1]);

                if (!inputA || !inputB) {
                    this.result.missingConnections.push(gate.id);
                    return;
                }

                if (inputA.state === TriState.Floating || inputB.state === TriState.Floating) gate.state = TriState.Floating;
                else if (inputA.state === TriState.True && inputB.state === TriState.True) gate.state = TriState.True
                else gate.state = TriState.False;
            }
            if (gate.type === GateType.NOT) {
                const inputA: Gate = this.getGateById(gate.inputs[0]);

                if (!inputA) {
                    this.result.missingConnections.push(gate.id);
                    return;
                }

                if (inputA.state === TriState.True) gate.state = TriState.False;
                else if (inputA.state === TriState.False) gate.state = TriState.True;
                else gate.state = TriState.Floating;
            }
        });
    }
}

export default Simulation;