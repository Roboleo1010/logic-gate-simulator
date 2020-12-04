import { TriState, GateType } from "../simulation/simulator.types";

export enum ConnectorSide {
    Top = "Top",
    Bottom = "Bottom",
    Left = "Left",
    Right = "Right"
}

export enum SignalDirection {
    In = "In",
    Out = "Out"
}

export interface ConnectorModel {
    id: string;
    side: ConnectorSide;
    direction: SignalDirection;
    gate: Gate;
    error: boolean;
}

export enum GateFunction {
    Controlled = "Controlled",
    Relay = "Relay",
    Clock = "Clock",
    Input = "Input", //For Switch
}

export interface Gate {
    id: string;
    name?: string;
    type: GateType;
    function?: GateFunction;
    direction?: SignalDirection;
    state: TriState;
    inputs: string[];
}

export interface Wire {
    inputId: string;
    outputId: string;
    state?: TriState;
}

export interface ChipBlueprint {
    name: string;
    description?: string;
    color: string;
    category?: string;
    wires?: Wire[];
    gates: Gate[];
}

export enum Tool {
    Move = "Move",
    Delete = "Delete"
}