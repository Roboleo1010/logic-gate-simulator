import Gate from "../gate";
import Graph from "../graph/graph";

class Chip {
    name: string;
    id: string;
    description: string;
    color: string;

    graph: Graph<Gate> = new Graph<Gate>();


    constructor(id: string, name: string, description: string, color: string) {
        this.name = name;
        this.id = id;
        this.description = description;
        this.color = color;
    }
}

export default Chip;