import {useEffect, useRef, useState} from "react";
import Rete, {Component, Engine, Node, NodeEditor} from "rete";
import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import {generateCode} from "./generateCode";
import {IsPositiveComponent} from "./components/PositiveComponent";
import ContextMenuPlugin from 'rete-context-menu-plugin';
import {ReturnAnyComponent} from "./components/returnAnyComponent";
import {ReadOnlyVarComponent} from "./components/ReadOnlyVarComponent";
import {numSocket, stringSocket} from "./sockets";
import {Constraint} from "../types";
import {useConstraints} from "../wrappers/ConstraintsWrapper";
import DockPlugin from 'rete-dock-plugin';
import AreaPlugin from 'rete-area-plugin';

let index = 0;

export function freshIndex() {
    return ++index;
}

function createEditor(container: HTMLElement): NodeEditor {
    const editor: NodeEditor = new Rete.NodeEditor("demo@0.1.0", container);
    editor.use(ConnectionPlugin);
    editor.use(ReactRenderPlugin);
    editor.use(ContextMenuPlugin, {
        searchBar: true,
    });
    try {
        // @ts-ignore
        editor.use(DockPlugin, {
            container: document.querySelector('.dock'),
            plugins: [ReactRenderPlugin],
            itemClass: 'dock-item',
        });
    } catch (e) {
        console.error(e);
        return editor;
    }
    return editor;
}

async function newNode(x: number, y: number, variableName: string, component: Component): Promise<Node> {
    const node: Node = await component.createNode({variableName: variableName});
    node.position = [x, y];
    return node;
}

async function initRete(container: HTMLElement, constraint: Constraint, setCode: Function): Promise<NodeEditor> {
    const engine: Engine = new Rete.Engine("demo@0.1.0");
    const editor: NodeEditor = createEditor(container);

    const numComponent: ReadOnlyVarComponent = new ReadOnlyVarComponent("Number", numSocket, "num");
    const stringComponent: ReadOnlyVarComponent = new ReadOnlyVarComponent("String", stringSocket, "num");
    const positiveComponent: IsPositiveComponent = new IsPositiveComponent(editor);
    const returnBoolComponent: ReturnAnyComponent = new ReturnAnyComponent(editor);
    const components: Component[] = [numComponent, positiveComponent, returnBoolComponent, stringComponent]

    components.forEach((c) => {
        editor.register(c);
        engine.register(c);
    })

    if (constraint.rete !== undefined) {
        await editor.fromJSON(constraint.rete);
    } else {
        editor.addNode(await newNode(100, 200, constraint.fromId, numComponent));
        editor.addNode(await newNode(900, 200, "", returnBoolComponent));
    }

    editor.on(
        // @ts-ignore
        "process noderemoved connectioncreated connectionremoved",
        async () => {
            const sourceCode: string = await generateCode(engine, editor.toJSON());
            console.log(sourceCode);
            console.log(editor.nodes);
            setCode(await generateCode(engine, editor.toJSON()));
        }
    );

    editor.on("nodecreated", async (node: Node) => {
        if (node.name.match(new RegExp(".*positive.*"))) {
            node.data = {variableName: `positive${freshIndex()}`}
        } else if (node.name.match(new RegExp(".*IF.*"))) {
            node.data = {variableName: `if${freshIndex()}`}
        } else if (node.name.match(new RegExp(".*literal.*"))) {
            node.data = {variableName: `literal${freshIndex()}`}
        }
    })

    editor.view.resize();

    return editor;
}


export function useRete(): [(HTMLElement: HTMLElement) => void, (constraint: Constraint) => void, any] {
    const constraints = useConstraints();
    const [constraint, setConstraint] = useState<Constraint | undefined>(undefined);
    const [container, setContainer] = useState<HTMLElement | null>(null);
    const editorRef = useRef<NodeEditor>();
    const [code, setCode] = useState("");

    useEffect(() => {
        if (container && constraint) {
            initRete(container, constraint, setCode).then((value: NodeEditor) => {
                editorRef.current = value;
                AreaPlugin.zoomAt(editorRef.current);
            });
        }
    }, [container, constraint]);

    useEffect(() => {
        return () => {
            if (editorRef.current) {
                editorRef.current.destroy();
            }
        };
    }, []);

    function onClose() {
        if (editorRef.current && constraint) {
            constraints.updateConstraint(constraint, {
                ...constraint,
                code: code,
                rete: editorRef.current.toJSON(),
            })
            console.log(editorRef.current.toJSON());
            editorRef.current.clear()
            editorRef.current.destroy();
            setConstraint(undefined);
        }
    }

    return [setContainer, setConstraint, onClose];
}
