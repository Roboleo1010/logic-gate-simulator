import { Gate, Wire } from "../simulation/simulator.types";

export enum ConnectorSide {
    Top = "Top",
    Bottom = "Bottom",
    Left = "Left",
    Right = "Right"
}

export enum ConnectorDirection {
    SignalIn = "SignalIn",
    SignalOut = "SignalOut"
}

export interface ChipBlueprint {
    name: string;
    description?: string;
    color: string;
    category?: string;
    wires?: Wire[];
    gates?: Gate[];
}

export interface ConnectorModel {
    id: string;
    side: ConnectorSide;
    direction: ConnectorDirection;
    gate: Gate;
    error: boolean;
}

export enum Tool {
    Move = "Move",
    Delete = "Delete"
}