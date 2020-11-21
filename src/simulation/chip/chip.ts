import Graph from "../../utility/graph/graph";
import Chiplet from "./chiplet";

class Chip {
    graph: Graph<Chiplet> = new Graph<Chiplet>();


    constructor(id: string) {

    }
}

export default Chip;