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

export interface ConnectorModel {
    id: string;
    side: ConnectorSide;
    direction: ConnectorDirection;
}

export interface ChipBlueprint {
    name: string;
    color: string;
    category?: string;
}

export interface WireModel {
    inputId: string;
    outputId: string;
}