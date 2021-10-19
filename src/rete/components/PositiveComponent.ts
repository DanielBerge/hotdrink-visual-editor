import Rete, {Node, NodeEditor} from "rete";
import {NodeData, WorkerInputs, WorkerOutputs} from "rete/types/core/data";
import {boolSocket, numSocket} from "../sockets";
import {getInputVariable} from "../reteUtils";


export class IsPositiveComponent extends Rete.Component {
    editor: NodeEditor;

    constructor(editor: NodeEditor) {
        super("Number is positive");
        this.editor = editor;
    }

    async builder(node: Node): Promise<void> {
        const out = new Rete.Output("bool", "Boolean", boolSocket);
        const inp = new Rete.Input("numKey", "Number", numSocket);

        node.addInput(inp).addOutput(out);
    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
    }

    code(node: NodeData, inputs: WorkerInputs, add: (name: string, expression?: any) => void) {
        const variable: unknown | undefined = getInputVariable("numKey", node, this.editor);
        if (variable !== undefined) {
            add(node.data["variableName"] as string, `${variable} >= 0`);
        }
    }
}
