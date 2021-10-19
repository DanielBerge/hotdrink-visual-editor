import Rete, {Node, NodeEditor} from "rete";
import {NodeData, WorkerInputs, WorkerOutputs} from "rete/types/core/data";
import {anySocket, boolSocket, codeBlockSocket, numSocket} from "../sockets";
import {getInputVariable} from "../reteUtils";

export class IfComponent extends Rete.Component {
    editor: NodeEditor;

    constructor(editor: NodeEditor) {
        super("IF Block");
        this.editor = editor;
    }

    async builder(node: Node): Promise<void> {
        const inp = new Rete.Input("bool", "Boolean", boolSocket);
        const out1 = new Rete.Output("codeBlock1", "Run", codeBlockSocket);
        const out2 = new Rete.Output("codeBlock2", "Run", codeBlockSocket);

        node.addInput(inp).addOutput(out1).addOutput(out2);
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        outputs["codeBlock1"] = "";
        outputs["codeBlock2"] = "";
    }

    code(node: NodeData, inputs: WorkerInputs, add: (name: string, expression?: any) => void) {
        const variable: unknown | undefined = getInputVariable("bool", node, this.editor);
        if (variable !== undefined) {
            add(`if (${variable})`);
        }
    }
}
