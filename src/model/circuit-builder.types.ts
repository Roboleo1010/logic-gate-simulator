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
    InputActive = "InputActive",
    InputInactive = "InputInactive"
}

export interface WireModel {
    fromId: string;
    toId: string;
}

export interface Gate {
    id: string;
    state: TriState;
    type: GateType;
    signalDirection?: SignalDirection;
    role?: GateRole;
}

export interface CircuitBuilderContext {
    isSimulationRunning: boolean;
    activeTool: Tool;
}