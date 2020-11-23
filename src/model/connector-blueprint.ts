export enum ConnectorSide {
    Top,
    Bottom,
    Left,
    Right
}

export enum ConnectorDirection {
    SignalIn,
    SignalOut
}


class ConnectorBlueprint {
    public name: string;
    public side: ConnectorSide;
    public direction: ConnectorDirection;

    constructor(name: string, side: ConnectorSide, direction: ConnectorDirection) {
        this.name = name;
        this.side = side;
        this.direction = direction;
    }
}

export default ConnectorBlueprint;