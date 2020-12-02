import { GateType, TriState, Wire, Gate, SimulationResult } from "./simulator.types";

class Simulation {
    private gates: Gate[] = [];
    private wires: Wire[] = [];

    evalsPerTick: number = 10;

    constructor(gates: Gate[], wires: Wire[]) {
        this.gates = gates;
        this.wires = wires;
    }

    public simulate() {
        console.log(`Added ${this.gates.length} Gates.`);
        console.log(this.gates);

        this.wires.forEach(wire => {
            this.getGateById(wire.outputId).inputs = [wire.inputId];
        });

        console.log(`Added ${this.wires.length} Wires.`);
        console.log(this.wires);

        console.log(`%cRunning Simulation with ${this.evalsPerTick} steps per Tick`, 'color: #bada55');

        console.time("simulation");

        for (let i = 0; i < this.evalsPerTick; i++)
            this.evaluate();
        1
        console.timeEnd("simulation")
    }

    public getResults(): SimulationResult[] {
        return this.gates.map(gate => { return { id: gate.id, state: gate.state } });
    }

    private getGateById(id: string): Gate {
        return this.gates.filter(chip => chip.id === id)[0];
    }

    private evaluate() {
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

    private printState(gateIds: string[] = []) {

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
}

export default Simulation;