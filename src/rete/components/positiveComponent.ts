import Rete, {Node, NodeEditor} from "rete";
import {NodeData, WorkerInputs, WorkerOutputs} from "rete/types/core/data";
import {boolSocket, numSocket} from "../sockets";


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
        outputs["bool"] = node.data.bool;
    }

    code(node: NodeData, inputs: WorkerInputs, add: (name: string, expression?: any) => void) { // 'node' parameter as in worker()
        const inpIndex = node.inputs["numKey"].connections[0].node;
        const variable = this.editor.nodes[inpIndex - 1].data["variableName"];
        add("positive", `${variable} >= 0`); // add a variable with the value "node.data.num"
    }
}
