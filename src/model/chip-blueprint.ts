import ConnectorBlueprint, { ConnectorSide } from "./connector-blueprint";

class ChipBlueprint {
    name: string;
    color: string;

    public connectorsTop: ConnectorBlueprint[];
    public connectorsBottom: ConnectorBlueprint[];
    public connectorsLeft: ConnectorBlueprint[];
    public connectorsRight: ConnectorBlueprint[];

    constructor(name: string, color: string, connectors: ConnectorBlueprint[]) {
        this.name = name;
        this.color = color;

        this.connectorsTop = connectors.filter(connector => connector.side === ConnectorSide.Top)
        this.connectorsBottom = connectors.filter(connector => connector.side === ConnectorSide.Bottom)
        this.connectorsLeft = connectors.filter(connector => connector.side === ConnectorSide.Left)
        this.connectorsRight = connectors.filter(connector => connector.side === ConnectorSide.Right)
    }

    public getConnectorArrays(): ConnectorBlueprint[][] {
        let result: ConnectorBlueprint[][] = [];

        if (this.connectorsTop.length > 0)
            result.push(this.connectorsTop);
        if (this.connectorsBottom.length > 0)
            result.push(this.connectorsBottom);
        if (this.connectorsLeft.length > 0)
            result.push(this.connectorsLeft);
        if (this.connectorsRight.length > 0)
            result.push(this.connectorsRight);

        return result;
    }
}

export default ChipBlueprint;