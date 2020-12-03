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

export enum GateFunction {
    Controlled = "Controlled",
    Output = "Output",
    Clock = "Clock",
    Switch = "Switch",
}

export interface Wire {
    inputId: string;
    outputId: string;
    state?: TriState;
}

export interface Gate {
    id: string;
    name?: string;
    type: GateType;
    function?: GateFunction;
    state: TriState;
    inputs: string[];
}

export interface SimulationResult {
    states: SimulationState[];
    time: number;
    gates: Gate[];
    wires: Wire[];
    error: boolean;
    missingConnections: string[];
    errorMessage?: string;
}

export interface SimulationState {
    id: string;
    state: TriState;
}