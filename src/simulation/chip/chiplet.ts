import { ChipletType } from "./chip.types";

class Chiplet {
    id: string;
    type: ChipletType;
    extraInputs: string;

    constructor(id: string, type: ChipletType, extraInputs: string = '') {
        this.id = id;
        this.type = type;
        this.extraInputs = extraInputs;
    }
}

export default Chiplet;