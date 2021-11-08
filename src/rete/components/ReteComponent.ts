import Rete, {Node, NodeEditor} from "rete";
import {NodeData, WorkerInputs, WorkerOutputs} from "rete/types/core/data";
import {CustomNode} from "../CustomNode";
import {getInputVariable} from "../reteUtils";
import {BlockConnection} from "../blockBuilder";
import {ReteControl} from "../control/ReteControl";

export class ReteComponent extends Rete.Component {
    private readonly inputs: BlockConnection[];
    private readonly outputs: BlockConnection[];
    private control: ReteControl | undefined;

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
        if (this.inputs.length === 1) {
            this.control = new ReteControl(this.editor, "key", node)
            node.addControl(this.control);
        }
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]): void {
    }

    code(node: NodeData, inputs: WorkerInputs, add: (name: string, expression?: any) => void) {
        let variables = this.inputs.map(input => getInputVariable(input.key, node, this.editor));
        if (this.inputs.length === 1) {
            add(node.data["variableName"] as string, `parseInt(${variables[0]}) ${this.operator} ${this.control?.props.value}`);
        } else {
            add(node.data["variableName"] as string, `${variables.map((variable) => `parseInt(${variable}) ${this.operator}`).join(" ")})`.slice(0, -3));
        }
    }
}