import Rete, {Node} from "rete";
import {codeBlockSocket, stringSocket} from "../sockets";
import {NodeData, WorkerInputs, WorkerOutputs} from "rete/types/core/data";

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
        if (node.inputs["stringKey1"].connections[0].output === "codeBlock1") {
            outputs["stringKey"] = "codeBlock1";
        }
        if (node.inputs["stringKey1"].connections[0].output === "codeBlock2") {
            outputs["stringKey"] = "codeBlock2";
        }
    }

    code(node: NodeData, inputs: WorkerInputs, add: (name: string, expression?: any) => void) {
        //add(this.variable, node.data.variable);
    }
}
