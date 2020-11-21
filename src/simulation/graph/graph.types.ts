export interface GraphNode {
    id: string;
}

export type GraphTest<T> = T & GraphNode;