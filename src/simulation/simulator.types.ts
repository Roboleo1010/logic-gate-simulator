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

export interface Wire {
    inputId: string;
    outputId: string;
    state?: TriState;
}

export interface Gate {
    id: string;
    type: GateType;
    state: TriState;
    inputs: string[];
}

export interface SimulationResult {
    id: string;
    state: TriState;
}