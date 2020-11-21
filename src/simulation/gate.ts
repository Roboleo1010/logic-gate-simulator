import { GateType, TriState } from "./simulator.types";
import { GraphNode } from "./graph/graph.types"

class Gate implements GraphNode {
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