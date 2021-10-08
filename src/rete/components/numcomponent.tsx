import Rete, {Node, NodeEditor} from "rete";
import {NodeData, WorkerInputs, WorkerOutputs} from "rete/types/core/data";
import {numSocket} from "../sockets";

/**
class NumControl extends Rete.Control {
    emitter: NodeEditor | null;
    component: ({value, onChange}: any) => JSX.Element;
    props: { readonly: boolean; onChange: (v: any) => void; value: number };

    constructor(emitter: NodeEditor | null, key: any, node: any, readonly = false) {
        super(key);
        this.emitter = emitter;
        this.key = key;
        this.component = NumControl.component;

        const initial = node.data[key] || 0;

        node.data[key] = initial;
        this.props = {
            readonly,
            value: initial,
            onChange: (v) => {
                this.setValue(v);
                this.emitter?.trigger("process");
            }
        };
    }

    static component = ({value, onChange}: any) => (
        <input
            type="number"
            value={value}
            ref={(ref) => {
                ref && ref.addEventListener("pointerdown", (e) => e.stopPropagation());
            }}
            onChange={(e) => onChange(+e.target.value)}
        />
    );

    setValue(val: any) {
        this.props.value = val;
        this.putData(this.key, val);
        //this.update();
        this.getNode().update()
    }
}
**/

export class NumComponent extends Rete.Component {
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
        add(this.variable, node.data.variable); // add a variable with the value "node.data.num"
    }
}