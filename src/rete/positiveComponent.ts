import Rete, {Node} from "rete";
import {NodeData, WorkerInputs, WorkerOutputs} from "rete/types/core/data";
import {boolSocket, numSocket} from "./sockets";


export class IsPositiveComponent extends Rete.Component {
    constructor() {
        super("Number is positive");
    }

    async builder(node: Node): Promise<void>{
        const out = new Rete.Output("bool", "Boolean", boolSocket);
        const inp = new Rete.Input("num", "Number", numSocket);

        node.addInput(inp).addOutput(out);
    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        outputs["bool"] = node.data.bool;
    }

    code(node: NodeData, inputs: WorkerInputs, add: (name: string, expression?: any) => void) { // 'node' parameter as in worker()
        console.log(inputs);
        console.log(inputs["num"]);
        add(""); // add a variable with the value "node.data.num"
    }
}
