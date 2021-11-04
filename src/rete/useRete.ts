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
import {Constraint, EditorType} from "../types";
import {useConstraints} from "../wrappers/ConstraintsWrapper";
import AreaPlugin from 'rete-area-plugin';
import {useEditor} from "../wrappers/EditorWrapper";
import {Block} from "./blockBuilder";
import DockPlugin from 'rete-dock-plugin';

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

async function initRete(container: HTMLElement, constraint: Constraint, onCodeUpdate: Function): Promise<NodeEditor> {
    const engine: Engine = new Rete.Engine("demo@0.1.0");
    const editor: NodeEditor = createEditor(container);

    const numComponent: ReadOnlyVarComponent = new ReadOnlyVarComponent("Number", numSocket, "num");
    const stringComponent: ReadOnlyVarComponent = new ReadOnlyVarComponent("String", stringSocket, "num");
    const positiveComponent: IsPositiveComponent = new IsPositiveComponent(editor);
    const returnAnyComponent: ReturnAnyComponent = new ReturnAnyComponent(editor);

    const block = new Block("Subtraction", "-", editor);
    block.addInput("num1", "newInp1", numSocket);
    block.addInput("num2", "newInp2", numSocket);
    block.addOutput("num3", "newOut", numSocket);

    const reteComponent = block.build();

    const components: Component[] = [reteComponent, numComponent, positiveComponent, returnAnyComponent, stringComponent]

    components.forEach((c) => {
        editor.register(c);
        engine.register(c);
    })

    if (constraint.rete !== undefined) {
        await editor.fromJSON(constraint.rete);
    } else {
        editor.addNode(await newNode(100, 200, constraint.fromId, numComponent));
        editor.addNode(await newNode(900, 200, "", returnAnyComponent));
    }

    editor.on(
        // @ts-ignore
        "process noderemoved connectioncreated connectionremoved",
        async () => {
            const sourceCode: string = await generateCode(engine, editor.toJSON());
            console.log(sourceCode);
            onCodeUpdate(sourceCode);
        }
    );

    editor.on("nodecreated", async (node: Node) => {
        node.data = {variableName: `var${freshIndex()}`}
    })

    editor.view.resize();

    return editor;
}


export function useRete(): [(HTMLElement: HTMLElement) => void, any] {
    const constraints = useConstraints();
    const editor = useEditor();
    const [container, setContainer] = useState<HTMLElement | null>(null);
    const editorRef = useRef<NodeEditor>();

    function onCodeUpdate(code: string) {
        editor.setCode(code);
        if (constraints.current) {
            constraints.updateConstraint(constraints.current, {
                ...constraints.current,
                code: editor.code,
                type: EditorType.VISUAL,
                rete: editorRef.current?.toJSON(),
            })
        }
    }

    useEffect(() => {
        if (container && constraints.current) {
            initRete(container, constraints.current, onCodeUpdate).then((value: NodeEditor) => {
                editorRef.current = value;
                AreaPlugin.zoomAt(editorRef.current);
            });
        }
    }, [container, constraints.current]);

    useEffect(() => {
        return () => {
            if (editorRef.current) {
                editorRef.current.destroy();
            }
        };
    }, []);


    function onClose() {
        if (editorRef.current && constraints.current && editor.type === EditorType.VISUAL) {
            constraints.updateConstraint(constraints.current, {
                ...constraints.current,
                code: editor.code,
                type: EditorType.VISUAL,
                rete: editorRef.current.toJSON(),
            })
        }
        constraints.setCurrent(undefined);
    }

    return [setContainer, onClose];
}
