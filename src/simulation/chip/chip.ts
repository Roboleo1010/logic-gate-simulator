import Gate from "../gate";
import Graph from "../graph/graph";

class Chip {
    name: string;
    description: string;
    color: string;

    graph: Graph<Gate> = new Graph<Gate>();


    constructor(name: string, description: string, color: string) {

        this.name = name;
        this.description = description;
        this.color = color;
    }
}

export default Chip;