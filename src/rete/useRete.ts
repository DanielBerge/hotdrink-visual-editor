import {useContext, useEffect, useRef, useState} from "react";
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

function createEditor(container: HTMLElement): NodeEditor {
    const editor: NodeEditor = new Rete.NodeEditor("demo@0.1.0", container);
    editor.use(ConnectionPlugin);
    editor.use(ReactRenderPlugin);
    editor.use(ContextMenuPlugin, {
        searchBar: false,
    });
    return editor;
}

async function newNode(x: number, y: number, variableName: string, component: Component): Promise<Node> {
    const node: Node = await component.createNode({variableName: variableName});
    node.position = [x, y];
    return node;
}

async function initRete(container: HTMLElement, constraint: Constraint, setCode: Function): Promise<NodeEditor> {
    const editor: NodeEditor = createEditor(container);
    const engine: Engine = new Rete.Engine("demo@0.1.0");

    const numComponent: ReadOnlyVarComponent = new ReadOnlyVarComponent("Number", numSocket, "num");
    const stringComponent: ReadOnlyVarComponent = new ReadOnlyVarComponent("String", stringSocket, "num");
    const positiveComponent: IsPositiveComponent = new IsPositiveComponent(editor);
    const returnBoolComponent: ReturnAnyComponent = new ReturnAnyComponent(editor);
    const components: Component[] = [numComponent, positiveComponent, returnBoolComponent, stringComponent]

    components.forEach((c) => {
        editor.register(c);
        engine.register(c);
    })

    editor.addNode(await newNode(200, 40, constraint.fromId, numComponent));
    editor.addNode(await newNode(600, 300, "positive", positiveComponent));
    editor.addNode(await newNode(800, 300, "", returnBoolComponent));

    editor.on(
        // @ts-ignore
        "process nodecreated noderemoved connectioncreated connectionremoved",
        async () => {
            const sourceCode: string = await generateCode(engine, editor.toJSON());
            console.log(sourceCode);
            setCode(await generateCode(engine, editor.toJSON()));
            await engine.abort();
            await engine.process(editor.toJSON());
        }
    );

    editor.view.resize();
    editor.trigger("process");
    //AreaPlugin.zoomAt(editor, editor.nodes);

    return editor;
}


export function useRete(): [any, any, any] {
    const constraints = useConstraints();
    const [constraint, setConstraint] = useState<Constraint | undefined>(undefined);
    const [container, setContainer] = useState<HTMLElement | null>(null);
    const editorRef = useRef<NodeEditor>();
    const [code, setCode] = useState("");

    useEffect(() => {
        if (container && constraint) {
            initRete(container, constraint, setCode).then((value: NodeEditor) => {
                editorRef.current = value;
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
        if (editorRef.current) {
            constraints.updateConstraint(constraint!, {
                ...constraint!,
                code: code,
            })
            editorRef.current.destroy();
        }
    }

    return [setContainer, setConstraint, onClose];
}
