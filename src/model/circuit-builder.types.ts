import ChipBlueprint from './chip-blueprint';
import { GateType, TriState } from '../simulation/simulator.types';

export enum Tool {
    Move = "Move",
    Delete = "Delete",
    Rename = "Rename"
}

export enum SignalDirection {
    In = "In",
    Out = "Out"
}

export enum GateRole {
    Switch = "Switch",
    Output = "Output",
    Clock = "Clock"
}

export interface WireModel {
    fromId: string;
    toId: string;
    state: TriState;
}

export interface Gate {
    id: string;
    name?: string;
    state: TriState;
    type: GateType;
    signalDirection?: SignalDirection;
    role?: GateRole;
    isFirstLayer: boolean;
    error?: boolean;
    hidden?: boolean;
}

export interface CircuitBuilderContext {
    isSimulationRunning: boolean;
    activeTool: Tool;
}

export interface BlueprintSaveData {
    version: number;
    blueprints: ChipBlueprint[];
}