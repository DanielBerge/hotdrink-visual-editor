import {useEffect, useRef, useState} from "react";
import Rete from "rete";
import {NumComponent} from "./numcomponent";
import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";

export async function createEditor(container: HTMLElement) {
    const components = [new NumComponent()];

    const editor = new Rete.NodeEditor("demo@0.1.0", container);
    editor.use(ConnectionPlugin);
    editor.use(ReactRenderPlugin);

    const engine = new Rete.Engine("demo@0.1.0");

    components.map((c) => {
        editor.register(c);
        engine.register(c);
        return null;
    });

    const n1 = await components[0].createNode({num: 2});
    const n2 = await components[0].createNode({num: 3});

    n1.position = [80, 200];
    n2.position = [80, 400];

    editor.addNode(n1);
    editor.addNode(n2);

    editor.on(
        // @ts-ignore
        "process nodecreated noderemoved connectioncreated connectionremoved",
        async () => {
            console.log("process");
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
    const [container, setContainer] = useState<any>(null);
    const editorRef = useRef<any>();

    useEffect(() => {
        if (container) {
            createEditor(container).then((value) => {
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
