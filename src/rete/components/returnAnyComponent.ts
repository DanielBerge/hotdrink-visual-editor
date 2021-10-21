import Rete, {Node, NodeEditor} from "rete";
import {anySocket} from "../sockets";
import {InputConnectionData, NodeData, WorkerInputs, WorkerOutputs} from "rete/types/core/data";
import {getInputVariable} from "../reteUtils";

export class ReturnAnyComponent extends Rete.Component {
    editor: NodeEditor;

    constructor(editor: NodeEditor) {
        super("Return any");
        this.editor = editor;
    }

    async builder(node: Node): Promise<void> {
        const input = new Rete.Input("any", "Any", anySocket);
        //input.multipleConnections = true;

        node.addInput(input);
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
    }

    code(node: NodeData, inputs: WorkerInputs, add: (name: string, expression?: any) => void) {
        const variable: unknown | undefined = getInputVariable("any", node, this.editor);
        if (variable !== undefined) {
            add(`return ${variable}`);
        }
    }
}


