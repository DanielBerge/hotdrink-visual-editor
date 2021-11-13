import Editor, {Monaco} from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import {useRef} from "react";
import {useConstraints} from "../wrappers/ConstraintsWrapper";
import {useEditor} from "../wrappers/EditorWrapper";
import {EditorType} from "../types";

export const CodeEditor = () => {
    const constraints = useConstraints();
    const editor = useEditor();
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

    function handleBeforeMount(monaco: Monaco) {
        monaco.editor.EditorOptions.formatOnType.defaultValue = true;
    }

    function handleOnMount(editor: monaco.editor.IStandaloneCodeEditor) {
        editorRef.current = editor;
    }

    function handleEditorChange(value: string | undefined, _: monaco.editor.IModelContentChangedEvent) {
        if (constraints.current && constraints.currentMethod && editor.type === EditorType.CODE) {
            constraints.setCurrentMethod(
                constraints.updateMethod(constraints.currentMethod, {
                    ...constraints.currentMethod,
                    code: value ?? "",
                    type: EditorType.CODE,
                    visualJson: undefined,
                }, constraints.current)
            )
        }
    }

    return (
        <div className="flex h-96 flex-col">
            <p
                className="p-2"
            >Variables in scope: {constraints.current?.fromIds}</p>
            <Editor
                height="100%"
                defaultLanguage={"javascript"}
                defaultValue={constraints.currentMethod?.code ?? ""}
                beforeMount={handleBeforeMount}
                onChange={handleEditorChange}
                onMount={handleOnMount}
            />
        </div>
    )
}