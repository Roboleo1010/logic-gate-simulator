export enum TriState {
    True = "True",
    False = "False",
    Floating = "Floating"
}

export enum GateType {
    Controlled = "Controlled",
    Relay = "Relay",
    AND = "AND",
    NOT = "NOT",
}

export interface WireConnection {
    outputId: string;
    input: string;
}