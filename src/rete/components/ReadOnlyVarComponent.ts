import Rete, {Node, Socket} from "rete";
import {NodeData, WorkerInputs, WorkerOutputs} from "rete/types/core/data";

export class ReadOnlyVarComponent extends Rete.Component {
    private readonly variable: string;
    private readonly socket: Socket;
    private readonly socketName: string;

    constructor(socketName: string, socket: Socket, variable: string) {
        super(`Input variable: ${socketName}`);
        this.socketName = socketName;
        this.variable = variable;
        this.socket = socket;
    }

    async builder(node: Node): Promise<void> {
        const output = new Rete.Output(this.variable, this.socketName, this.socket);
        node.addOutput(output);
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        outputs["variable"] = node.data.variable;
    }
}
