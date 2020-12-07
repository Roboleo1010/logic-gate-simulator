import { GateType, TriState } from '../simulation/simulator.types';

export enum Tool {
    Move = "Move",
    Delete = "Delete"
}

export enum GateRole {
    Input = "Input",
    Output = "Output"
}

export interface WireModel {
    fromId: string;
    toId: string;
}

export interface Gate {
    id: string;
    state: TriState;
    type: GateType;
    role?: GateRole;
}