export interface BlockConnection {
    id: string;
    title: string;
}

export class Block {
    inputs: BlockConnection[];
    outputs: BlockConnection[];

    constructor(public name: string, public operator: string) {
        this.inputs = [];
        this.outputs = [];
    }

    addInput(title: string, id: string) {
        this.inputs.push({title, id});
    }

    addOutput(title: string, id: string) {
        this.outputs.push({title, id});
    }

    build(): any {

    }
}