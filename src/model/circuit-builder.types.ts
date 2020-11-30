import { GateType } from "../simulation/simulator.types";

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
    color: string;
    category?: string;
    wires?: WireModel[];
    gates?: GateBlueprint[];
}

export interface GateBlueprint {
    type: GateType;
    inputCount: number;
    outputCount: number;
}

export interface ConnectorModel {
    id: string;
    side: ConnectorSide;
    direction: ConnectorDirection;
}

export interface WireModel {
    inputId: string;
    outputId: string;
}