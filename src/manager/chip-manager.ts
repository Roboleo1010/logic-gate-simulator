import { ChipBlueprint } from "../model/circuit-builder.types";

class ChipManager {
    private chips: Map<string, ChipBlueprint> = new Map();
    private chipIds: Map<string, number> = new Map();

    private static instance: ChipManager;

    private constructor() {
        ChipManager.instance = this;

        this.loadData();
    }

    private loadData() {//TODO: From Firebase
        this.chips.set("AND", { name: "AND", color: "#729B79", category: "logic" });
        this.chips.set("NOT", { name: "NOT", color: "#D05353", category: "logic" });

        this.chips.set("Input", { name: "Input", color: "#386FA4", category: "io" });
        this.chips.set("Output", { name: "Output", color: "#386FA4", category: "io" });
        this.chips.set("Constant On", { name: "Constant On", color: "#6DA34D", category: "io" });
        this.chips.set("Constant Off", { name: "Constant Off", color: "#D10000", category: "io" });
        this.chips.set("Oscilloscope", { name: "Oscilloscope", color: "#000000", category: "io" });
    }

    public static getInstance() {
        if (!ChipManager.instance)
            new ChipManager();

        return ChipManager.instance;
    }

    public getChip(name: string) {
        if (this.chips.has(name))
            return this.chips.get(name);

        return "";
    }

    public getByCategory(category: string): ChipBlueprint[] {
        let chips: ChipBlueprint[] = [];

        if (category)
            this.chips.forEach(chip => {
                if (chip.category === category)
                    chips.push(chip);
            });
        else
            this.chips.forEach(chip => {
                if (chip.category === undefined)
                    chips.push(chip);
            });

        return chips;
    }

    public getNextId(name: string): number {
        if (!this.chipIds.has(name)) {
            this.chipIds.set(name, 0);
            return 0;
        }

        let id = this.chipIds.get(name);

        if (id !== undefined) {
            id++;
            this.chipIds.set(name, id);
            return id;
        }

        console.error("Error while getting new ChipId");
        return -1;
    }
}

export default ChipManager;