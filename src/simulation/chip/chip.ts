import Graph from "../graph/graph";
import Chiplet from "./chiplet";

class Chip {
    name: string;
    description: string;
    color: string;

    graph: Graph<Chiplet> = new Graph<Chiplet>();


    constructor(id: string, name: string, description: string, color: string) {
        this.name = name;
        this.description = description;
        this.color = color;
    }
}

export default Chip;