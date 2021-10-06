import {useEffect, useRef, useState} from "react";
import Rete, {Component, Engine, Node, NodeEditor} from "rete";
import {NumComponent} from "./numcomponent";
import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import {generateCode} from "./generateCode";
import {IfComponent} from "./ifComponent";
import {IsPositiveComponent} from "./positiveComponent";
import ContextMenuPlugin, { Menu, Item, Search } from 'rete-context-menu-plugin';


export async function createEditor(container: HTMLElement): Promise<NodeEditor> {
    //const ifComponent: IfComponent = new IfComponent();
    const numComponent: NumComponent = new NumComponent();
    const positiveComponent: IsPositiveComponent = new IsPositiveComponent();
    const components: Component[] = [numComponent, positiveComponent]

    const editor: NodeEditor = new Rete.NodeEditor("demo@0.1.0", container);
    editor.use(ConnectionPlugin);
    editor.use(ReactRenderPlugin);
    editor.use(ContextMenuPlugin, {
        searchBar: false,
    });

    const engine: Engine = new Rete.Engine("demo@0.1.0");

    components.forEach((c) => {
        editor.register(c);
        engine.register(c);
    });

    const n1: Node = await numComponent.createNode({num: 2});
    const n2: Node = await numComponent.createNode({num: 3});
    //const n3: Node = await ifComponent.createNode({bool: true});
    const n4: Node = await positiveComponent.createNode({});

    n1.position = [80, 200];
    n2.position = [80, 400];
    //n3.position = [300, 300];
    n4.position = [800, 300];

    editor.addNode(n1);
    editor.addNode(n2);
    //editor.addNode(n3);
    editor.addNode(n4);

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
