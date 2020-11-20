//Gate is the smallest possible unit.

import { GateType as GateType, TriState } from "./simulator.types";

class Gate {
    id: string;
    type: GateType;
    state: TriState;
    inputs: string[];

    constructor(id: string, type: GateType, state: TriState, inputs: string[]) {
        this.id = id;
        this.type = type;
        this.state = state;
        this.inputs = inputs;
    }
}

export default Gate;