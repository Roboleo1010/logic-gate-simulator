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
    color: string;
    category?: string;
    wires?: Wire[];
    gates?: Gate[];
}

export interface ConnectorModel {
    id: string;
    side: ConnectorSide;
    direction: ConnectorDirection;
}

export enum Tool {
    move = "move",
    delete = "delete",
    simulate = "simulate"
}