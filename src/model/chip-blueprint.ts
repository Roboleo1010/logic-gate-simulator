import Graph from '../utilities/graph/graph';
import { Gate } from './circuit-builder.types';

class ChipBlueprint {
    public name: string;
    public color: string;
    public graph: Graph<Gate>;
    public category: string;
    public description?: string;

    constructor(name: string, color: string, category: string, graph: Graph<Gate>, description?: string) {
        this.name = name;
        this.color = color;
        this.category = category;
        this.graph = graph;
        this.description = description;
    }
}

export default ChipBlueprint;