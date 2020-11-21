import { GateType } from "../simulator.types";

//just a wrapper around gate
class Chiplet {
    id: string;
    type: GateType;
    extraInputs: string;

    constructor(id: string, type: GateType, extraInputs: string = '') {
        this.id = id;
        this.type = type;
        this.extraInputs = extraInputs;
    }
}

export default Chiplet;