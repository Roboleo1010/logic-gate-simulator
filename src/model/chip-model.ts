import ChipManager from "../manager/chip-manager";
import { Gate, GateType } from "../simulation/simulator.types";
import { ChipBlueprint, ConnectorDirection, ConnectorModel, ConnectorSide } from "./circuit-builder.types";

class ChipModel {
    public blueprint: ChipBlueprint;
    public id: string;

    public connectors: ConnectorModel[][] = [];
    public gates: Gate[] = [];

    constructor(blueprint: ChipBlueprint) {
        let chipManager = ChipManager.getInstance();

        this.blueprint = blueprint;
        this.id = `${blueprint.name}_${chipManager.getNextChipId(blueprint.name)}`;

        //Add Gates
        blueprint.gates?.forEach(gate => {
            this.gates.push({ id: `${this.id}_${gate.id}`, state: gate.state, type: gate.type, function: gate.function, name: gate.name, inputs: gate.inputs.map(id => `${this.id}_${id}`) });
        });

        let connectors: ConnectorModel[] = [];

        //Add Connectors to Chip
        this.gates.forEach(gate => {
            if (gate.type !== GateType.Relay)
                return;

            if (gate.inputs.length > 0)
                connectors.push({ direction: ConnectorDirection.SignalOut, side: ConnectorSide.Right, id: gate.id, error: false, gate: gate });
            else
                connectors.push({ direction: ConnectorDirection.SignalIn, side: ConnectorSide.Left, id: gate.id, error: false, gate: gate });
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