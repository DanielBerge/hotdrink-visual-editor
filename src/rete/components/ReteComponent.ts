import Rete, {Node, NodeEditor} from "rete";
import {NodeData, WorkerInputs, WorkerOutputs} from "rete/types/core/data";
import {CustomNode} from "../CustomNode";
import {getInputVariable} from "../reteUtils";
import {BlockConnection} from "../blockBuilder";

export class ReteComponent extends Rete.Component {
    private readonly inputs: BlockConnection[];
    private readonly outputs: BlockConnection[];

    constructor(public name: string, public operator: string, inputs: BlockConnection[], outputs: BlockConnection[], public editor: NodeEditor) {
        super(name);
        this.name = name;
        this.inputs = inputs;
        this.outputs = outputs;
        this.editor = editor;
        // @ts-ignore
        this.data.component = CustomNode;
    }

    async builder(node: Node): Promise<void> {
        for (const input of this.inputs) {
            node.addInput(new Rete.Input(input.key, input.title, input.socket));
        }

        for (const output of this.outputs) {
            node.addOutput(new Rete.Output(output.key, output.title, output.socket));
        }
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]): void {
    }

    code(node: NodeData, inputs: WorkerInputs, add: (name: string, expression?: any) => void) {
        let variables = this.inputs.map(input => getInputVariable(input.key, node, this.editor));
        add(node.data["variableName"] as string, `${variables.map((variable) => `parseInt(${variable}) ${this.operator}`).join(" ")})`.slice(0, -3));
    }
}