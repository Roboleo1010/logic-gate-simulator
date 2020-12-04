import ChipManager from "../manager/chip-manager";
import { ChipBlueprint, SignalDirection, ConnectorModel, ConnectorSide, Gate } from "./circuit-builder.types";

class ChipModel {
    public chipBlueprint: ChipBlueprint;
    public chipId: string;

    public connectors: ConnectorModel[][] = [];
    public gates: Gate[] = [];

    constructor(blueprint: ChipBlueprint) {
        let chipManager = ChipManager.getInstance();

        this.chipBlueprint = blueprint;
        this.chipId = `${blueprint.name}_${chipManager.getNextChipId(blueprint.name)}`;

        //Add Gates
        blueprint.gates?.forEach(gate => {
            let gateCopy = { ...gate };

            gateCopy.id = `${this.chipId}_${gate.id}`;
            gateCopy.inputs = gate.inputs.map(inputId => `${this.chipId}_${inputId}`);

            this.gates.push(gateCopy);
        });

        let connectors: ConnectorModel[] = [];

        //Add Connectors to Chip
        this.gates.forEach(gate => {
            if (gate.direction === SignalDirection.In || gate.direction === SignalDirection.Out)
                connectors.push({ direction: gate.direction, side: gate.direction === SignalDirection.In ? ConnectorSide.Left : ConnectorSide.Right, id: gate.id, error: false, gate: gate });
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