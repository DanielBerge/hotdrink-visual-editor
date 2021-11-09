import {useState} from "react";
import {EditorType} from "../types";
import {useConstraints} from "../wrappers/ConstraintsWrapper";
import {useEditor} from "../wrappers/EditorWrapper";

let index = 0;

export function freshIndex() {
    return ++index;
}

/**
 async function newNode(x: number, y: number, variableName: string, component: Component): Promise<Node> {
    const node: Node = await component.createNode({variableName: variableName});
    node.position = [x, y];
    return node;
}
 **/



export function useRete(): [(HTMLElement: HTMLElement) => void, any] {
    const constraints = useConstraints();
    const editor = useEditor();
    const [container, setContainer] = useState<HTMLElement | null>(null);

    function onCodeUpdate(code: string) {
        editor.setCode(code);
        if (constraints.current) {
            constraints.updateConstraint(constraints.current, {
                ...constraints.current,
                code: editor.code,
                type: EditorType.VISUAL,
                //rete: fromJson
            })
        }
    }

    function onClose() {
        if (constraints.current && editor.type === EditorType.VISUAL) {
        }
    }

    return [setContainer, onClose];
}
