import Rete, {Node} from "rete";
import {NodeData, WorkerInputs, WorkerOutputs} from "rete/types/core/data";
import {boolSocket, numSocket} from "../sockets";

export class IfComponent extends Rete.Component {
    constructor() {
        super("If component");
    }

    async builder(node: Node): Promise<void> {
        const inp = new Rete.Input("bool", "Boolean", boolSocket);
        const out1 = new Rete.Output("num1", "Number", numSocket);
        const out2 = new Rete.Output("num2", "Number", numSocket);

        node.addInput(inp).addOutput(out1).addOutput(out2);
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        outputs["num1"] = node.data.num;
        outputs["num2"] = node.data.num;
    }

    code(node: NodeData, inputs: WorkerInputs, add: (name: string, expression?: any) => void) { // 'node' parameter as in worker()
        add("if"); // add a variable with the value "node.data.num"
    }
}
