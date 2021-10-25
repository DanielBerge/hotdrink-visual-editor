import Editor, {Monaco, useMonaco} from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import {useEffect, useRef} from "react";
import {useConstraints} from "../wrappers/ConstraintsWrapper";
import {useEditor} from "../wrappers/EditorWrapper";
import {EditorType} from "../types";

export const CodeEditor = () => {
    const constraints = useConstraints();
    const editor = useEditor();
    const monaco = useMonaco();
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

    useEffect(() => {
        if (monaco) {
        }
    }, [monaco]);

    function handleBeforeMount(monaco: Monaco) {
        monaco.editor.EditorOptions.formatOnType.defaultValue = true;
    }

    function handleOnMount(editor: monaco.editor.IStandaloneCodeEditor) {
        editorRef.current = editor;
    }

    function handleEditorChange(value: string | undefined, _: monaco.editor.IModelContentChangedEvent) {
        if (constraints.current && editor.type === EditorType.CODE) {
            console.log(
                constraints.updateConstraint(constraints.current, {
                    ...constraints.current,
                    code: value ?? "",
                    type: EditorType.CODE,
                    rete: undefined,
                })
            )
        }
    }

    return (
        <div className="flex h-96">
            <Editor
                height="100%"
                defaultLanguage={"javascript"}
                defaultValue={constraints.current?.code ?? ""}
                beforeMount={handleBeforeMount}
                onChange={handleEditorChange}
                onMount={handleOnMount}
            />
        </div>
    )
}