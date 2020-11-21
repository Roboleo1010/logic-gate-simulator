import Edge from "./edge";
import { GraphTest } from "./graph.types";

class Graph<T> {
    nodes: GraphTest<T>[];
    edges: Edge[];

    constructor() {
        this.nodes = [];
        this.edges = [];
    }

    public addNode(newNode: GraphTest<T>) {
        if (this.nodes.find(node => node.id === newNode.id)) {
            console.warn(`Node ${newNode.id} already exsists.`);
            return;
        }

        this.nodes.push(newNode);
    }

    public addNodes(newNodes: GraphTest<T>[]) {
        newNodes.forEach(node => this.addNode(node));
    }

    public addEdge(newEdge: Edge) {
        if (this.edges.find(edge => edge.from === newEdge.from && edge.to === newEdge.to)) {
            console.warn(`Edge ${newEdge.from} -> ${newEdge.to} already exsists.`);
            return;
        }

        if (!this.nodes.find(node => node.id === newEdge.from)) {
            console.warn(`Node ${newEdge.from} doesn't exsist.`);
            return;
        }

        if (!this.nodes.find(node => node.id === newEdge.to)) {
            console.warn(`Node ${newEdge.from} doesn't exsist.`);
            return;
        }

        this.edges.push(newEdge);
    }

    public addEdges(newEdges: Edge[]) {
        newEdges.forEach(edge => this.addEdge(edge));
    }

    public getAllNodes(): T[] {
        return this.nodes;
    }
}
export default Graph;