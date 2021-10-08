import Rete, {Node, NodeEditor} from "rete";
import {boolSocket, numSocket} from "./sockets";
import {NodeData, WorkerInputs, WorkerOutputs} from "rete/types/core/data";

export class ReturnBooleanComponent extends Rete.Component {
    editor: NodeEditor;

    constructor(editor: NodeEditor) {
        super("Return boolean");
        this.editor = editor;
    }

    async builder(node: Node): Promise<void>{
        const input = new Rete.Input("bool", "Boolean", boolSocket);

        node.addInput(input);
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {

    }

    code(node: NodeData, inputs: WorkerInputs, add: (name: string, expression?: any) => void) { // 'node' parameter as in worker()
        const inpIndex = node.inputs["bool"].connections[0].node;
        const variable = this.editor.nodes[inpIndex - 1].data["variableName"];

        add(`return ${variable}`);
    }
}
