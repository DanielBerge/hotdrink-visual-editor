import Rete, {Node} from "rete";
import {codeBlockSocket, stringSocket} from "../sockets";
import {InputConnectionData, NodeData, WorkerInputs, WorkerOutputs} from "rete/types/core/data";

export class StringLiteralComponent extends Rete.Component {

    constructor() {
        super("String literal");
    }

    async builder(node: Node): Promise<void> {
        const output = new Rete.Output("stringKey", "String", stringSocket);
        const input = new Rete.Input("stringKey1", "Run", codeBlockSocket);

        node.addOutput(output).addInput(input);
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
    }

    code(node: NodeData, inputs: WorkerInputs, add: (name: string, expression?: any) => void) {
        const connections: InputConnectionData[] = node.inputs["any"].connections;
    }
}
