import {Input, NodeEditor, Output, Socket} from "rete";
import {ReteComponent} from "./components/ReteComponent";

export interface BlockConnection {
    key: string;
    title: string;
    socket: Socket;
}

export class Block {
    inputs: BlockConnection[];
    outputs: BlockConnection[];

    constructor(public name: string, public operator: string, public editor: NodeEditor) {
        this.inputs = [];
        this.outputs = [];
    }

    addInput(title: string, key: string, socket: Socket) {
        this.inputs.push({title, key, socket});
    }

    addOutput(title: string, key: string, socket: Socket) {
        this.outputs.push({title, key, socket});
    }

    build(): ReteComponent {
        return new ReteComponent(this.name, this.operator, this.inputs, this.outputs, this.editor);
    }
}