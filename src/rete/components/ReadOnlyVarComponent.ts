import Rete, {Node, Socket} from "rete";
import {NodeData, WorkerInputs, WorkerOutputs} from "rete/types/core/data";

export class ReadOnlyVarComponent extends Rete.Component {
    private readonly variable: string;
    private readonly socket: Socket;

    constructor(name: string, socket: Socket, variable: string) {
        super(name);
        this.variable = variable;
        this.socket = socket;
    }

    async builder(node: Node): Promise<void> {
        const output = new Rete.Output(this.variable, this.name, this.socket);
        node.addOutput(output);
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        outputs["variable"] = node.data.variable;
    }
}
