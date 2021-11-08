export interface BlockConnection {
    key: string;
    title: string;
}

export class Block {
    inputs: BlockConnection[];
    outputs: BlockConnection[];

    constructor(public name: string, public operator: string) {
        this.inputs = [];
        this.outputs = [];
    }

    addInput(title: string, key: string) {
        this.inputs.push({title, key});
    }

    addOutput(title: string, key: string) {
        this.outputs.push({title, key});
    }

    build(): any {

    }
}