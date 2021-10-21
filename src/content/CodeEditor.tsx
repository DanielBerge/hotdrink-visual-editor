import Editor, {Monaco, useMonaco} from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import {useEffect, useRef} from "react";

export const CodeEditor = () => {
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

    }

    return (
        <div className="flex h-96">
            <Editor
                height="100%"
                defaultLanguage={"javascript"}
                defaultValue={""}
                beforeMount={handleBeforeMount}
                onChange={handleEditorChange}
                onMount={handleOnMount}
            />
        </div>
    )
}