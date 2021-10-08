import {useEffect, useRef, useState} from "react";
import Rete, {Component, Engine, Node, NodeEditor} from "rete";
import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import {generateCode} from "./generateCode";
import {IsPositiveComponent} from "./components/positiveComponent";
import ContextMenuPlugin from 'rete-context-menu-plugin';
import {ReturnBooleanComponent} from "./components/returnBooleanComponent";
import {NumVarComponent} from "./components/numVarComponent";


export async function createEditor(container: HTMLElement): Promise<NodeEditor> {
    const editor: NodeEditor = new Rete.NodeEditor("demo@0.1.0", container);
    editor.use(ConnectionPlugin);
    editor.use(ReactRenderPlugin);
    editor.use(ContextMenuPlugin, {
        searchBar: false,
    });

    //const ifComponent: IfComponent = new IfComponent();
    const numComponent: NumVarComponent = new NumVarComponent("num");
    const positiveComponent: IsPositiveComponent = new IsPositiveComponent(editor);
    const returnBoolComponent: ReturnBooleanComponent = new ReturnBooleanComponent(editor);
    const components: Component[] = [numComponent, positiveComponent, returnBoolComponent]


    const engine: Engine = new Rete.Engine("demo@0.1.0");

    components.forEach((c) => {
        editor.register(c);
        engine.register(c);
    });

    const n1: Node = await numComponent.createNode({variableName: "num"});
    //const n3: Node = await ifComponent.createNode({bool: true});
    const n4: Node = await positiveComponent.createNode({variableName: "positive"});
    const n5: Node = await returnBoolComponent.createNode();

    n1.position = [80, 200];
    //n3.position = [300, 300];
    n4.position = [600, 300];
    n5.position = [800, 300]

    editor.addNode(n1);
    //editor.addNode(n3);
    editor.addNode(n4);
    editor.addNode(n5);

    editor.on(
        // @ts-ignore
        "process nodecreated noderemoved connectioncreated connectionremoved",
        async () => {
            const sourceCode: string = await generateCode(engine, editor.toJSON());
            console.log(sourceCode);
            console.log(editor.nodes);
            await engine.abort();
            await engine.process(editor.toJSON());
        }
    );

    editor.view.resize();
    editor.trigger("process");
    //AreaPlugin.zoomAt(editor, editor.nodes);


    return editor;
}


export function useRete() {
    const [container, setContainer] = useState<HTMLElement | null>(null);
    const editorRef = useRef<NodeEditor>();

    useEffect(() => {
        if (container) {
            createEditor(container).then((value: NodeEditor) => {
                editorRef.current = value;
            });
        }
    }, [container]);

    useEffect(() => {
        return () => {
            if (editorRef.current) {
                editorRef.current.destroy();
            }
        };
    }, []);

    return [setContainer];
}
