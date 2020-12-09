import { GateType, TriState } from '../simulation/simulator.types';

export enum Tool {
    Move = "Move",
    Delete = "Delete"
}

export enum SignalDirection {
    In = "In",
    Out = "Out"
}

export enum GateRole {
    Switch = "Switch",
    Output = "Output" //LED
}

export interface WireModel {
    fromId: string;
    toId: string;
    state: TriState;
}

export interface Gate {
    id: string;
    state: TriState;
    type: GateType;
    signalDirection?: SignalDirection;
    role?: GateRole;
    error?: boolean;
    hidden?: boolean;
}

export interface CircuitBuilderContext {
    isSimulationRunning: boolean;
    activeTool: Tool;
}