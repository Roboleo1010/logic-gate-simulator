import Graph from "../graph/graph";
import { ChipletType } from "./chip.types";
import Chiplet from "./chiplet";

class Chip extends Chiplet {
    name: string;
    description: string;
    color: string;

    graph: Graph<Chiplet> = new Graph<Chiplet>();


    constructor(id: string, name: string, description: string, color: string) {
        super(id, ChipletType.Chip)
        this.name = name;
        this.id = id;
        this.description = description;
        this.color = color;
    }
}

export default Chip;