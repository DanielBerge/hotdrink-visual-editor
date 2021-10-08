import Rete, {Node} from "rete";
import {numSocket} from "./sockets";
import {NodeData, WorkerInputs, WorkerOutputs} from "rete/types/core/data";

export class NumVarComponent extends Rete.Component {
    private readonly variable: string;

    constructor(variable: string) {
        super("Number");
        this.variable = variable;
    }

    async builder(node: Node): Promise<void>{
        const output = new Rete.Output(this.variable, "Number", numSocket);

        node.addOutput(output);
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        outputs["variable"] = node.data.variable;
    }

    code(node: NodeData, inputs: WorkerInputs, add: (name: string, expression?: any) => void) { // 'node' parameter as in worker()
        //add(this.variable, node.data.variable); // add a variable with the value "node.data.num"
    }
}
