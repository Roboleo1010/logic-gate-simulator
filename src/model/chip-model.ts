import ChipManager from "../manager/chip-manager";
import { ChipBlueprint, ConnectorDirection, ConnectorModel, ConnectorSide } from "./circuit-builder.types";

class ChipModel {
    public blueprint: ChipBlueprint;
    public id: string;

    public connectors: ConnectorModel[][] = [];

    constructor(blueprint: ChipBlueprint) {
        let chipManager = ChipManager.getInstance();

        this.blueprint = blueprint;
        this.id = `${blueprint.name}_${chipManager.getNextChipId(blueprint.name)}`;

        let connectors: ConnectorModel[] = [];

        //Adding Gates
        blueprint.gates?.forEach(gate => {
            for (let i = 0; i < gate.inputCount; i++)
                connectors.push({ direction: ConnectorDirection.SignalIn, side: ConnectorSide.Left, id: chipManager.getNextInputId() })

            for (let o = 0; o < gate.outputCount; o++)
                connectors.push({ direction: ConnectorDirection.SignalOut, side: ConnectorSide.Right, id: chipManager.getNextOutputId() })
        });

        this.filterConnectors(connectors);
    }

    private filterConnectors(connectors: ConnectorModel[]) {
        this.connectors.push(connectors.filter(connector => connector.side === ConnectorSide.Top));
        this.connectors.push(connectors.filter(connector => connector.side === ConnectorSide.Bottom));
        this.connectors.push(connectors.filter(connector => connector.side === ConnectorSide.Left));
        this.connectors.push(connectors.filter(connector => connector.side === ConnectorSide.Right));
    }
}

export default ChipModel;