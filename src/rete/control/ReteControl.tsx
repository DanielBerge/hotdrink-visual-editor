import Rete, {Node, NodeEditor} from "rete";

export class ReteControl extends Rete.Control {
    private component: ({value, onChange}: any) => JSX.Element;
    public props: { readonly: boolean; onChange: (v: any) => void; value: any };

    constructor(public editor: NodeEditor, public key: string, public node: Node, readonly = false) {
        super(key);
        this.editor = editor;
        this.key = key;
        this.component = ReteControl.component;

        node.data[key] = node.data[key] || 0;

        this.props = {
            readonly,
            value: node.data[key],
            onChange: (v: any) => {
                this.setValue(v);
                this.editor.trigger("process");
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
        // @ts-ignore
         this.update();
    }
}