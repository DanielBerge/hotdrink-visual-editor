import {NodeData} from "rete/types/core/data";
import {Node, NodeEditor} from "rete";

export function getInputVariable(inputKey: string, node: NodeData, editor: NodeEditor): undefined | unknown {
    if (node.inputs[inputKey].connections.length > 0) {
        const inpIndex: number = node.inputs[inputKey].connections[0].node;
        const connectionNode: Node | undefined = editor.nodes.find((node: Node) => node.id === inpIndex);

        if (connectionNode === undefined) {
            console.error("Could not find connectionnode variable");
        }
        return connectionNode?.data["variableName"];
    } else {
        return undefined;
    }
}
