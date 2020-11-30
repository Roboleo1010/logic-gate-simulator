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


class ConnectorModel {
    public name: string;
    public side: ConnectorSide;
    public direction: ConnectorDirection;

    constructor(name: string, side: ConnectorSide, direction: ConnectorDirection) {
        this.name = name;
        this.side = side;
        this.direction = direction;
    }
}

export default ConnectorModel;