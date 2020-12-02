//file for all web worker functions. copy function header to custom.d.ts

import Simulation from "../simulation/simulation";
import { Gate, SimulationResult, Wire } from "../simulation/simulator.types";

export function simulate(gates: Gate[], wires: Wire[]): SimulationResult[] {
    let simulation = new Simulation(gates, wires);
    simulation.simulate();

    return simulation.getResults();
}