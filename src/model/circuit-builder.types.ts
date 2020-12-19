import Graph from '../utilities/graph/graph';
import { GateType } from '../simulation/simulator.types';

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

export enum ChipCategory {
    Logic = "Logic",
    Io = "Io",
    Arithmetic = "Arithmetic",
    Memory = "Memory",
    Other = "Other"
}

export enum BlueprintType {
    Builtin = "Builtin",
    Custom = "Custom"
}

export enum PinSide {
    Top = "Top",
    Left = "Left",
    Bottom = "Bottom",
    Right = "Right"
}

export interface WireModel {
    fromId: string;
    toId: string;
    state: boolean;
}

export interface Gate {
    id: string;
    name?: string;
    state: boolean;
    type: GateType;
    signalDirection?: SignalDirection;
    pinSide?: PinSide;
    role?: GateRole;
    isFirstLayer: boolean;
    error?: boolean;
    hidden?: boolean;
}

export interface ChipBlueprint {
    name: string;
    color: string;
    graph: Graph<Gate>;
    category: ChipCategory;
    description?: string;
    type: BlueprintType;
}


export interface CircuitBuilderContext {
    isSimulationRunning: boolean;
    activeTool: Tool;
}

export interface BlueprintSaveData {
    version: number;
    blueprints: ChipBlueprint[];
}