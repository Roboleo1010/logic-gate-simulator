import ChipManager from "../manager/chip-manager";
import { ChipBlueprint, ConnectorModel, ConnectorSide } from "./circuit-builder.types";

class ChipModel {
    public blueprint: ChipBlueprint;
    public id: string;

    public connectors: ConnectorModel[][] = [];

    constructor(blueprint: ChipBlueprint) {
        let chipManager = ChipManager.getInstance();

        this.blueprint = blueprint;
        this.id = `${blueprint.name}_${chipManager.getNextId(blueprint.name)}`;


        // this.filterConnectors(connectors);
    }

    private filterConnectors(connectors: ConnectorModel[]) {
        this.connectors.push(connectors.filter(connector => connector.side === ConnectorSide.Top));
        this.connectors.push(connectors.filter(connector => connector.side === ConnectorSide.Bottom));
        this.connectors.push(connectors.filter(connector => connector.side === ConnectorSide.Left));
        this.connectors.push(connectors.filter(connector => connector.side === ConnectorSide.Right));
    }
}

export default ChipModel;