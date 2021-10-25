import {Modal} from "@mui/material";
import React, {FC, useEffect} from "react";
import {CodeEditor} from "./CodeEditor";
import {useEditor} from "../wrappers/EditorWrapper";
import {EditorType} from "../types";
import {useConstraints} from "../wrappers/ConstraintsWrapper";

interface Props {
    open: boolean;
    onClose: any;
    setContainer: any;
}

export const ConstraintEditor: FC<Props> = ({open, onClose, setContainer}) => {
    const constraints = useConstraints();
    const editor = useEditor();

    useEffect(() => {
        editor.setType(constraints.current?.type ?? EditorType.VISUAL);
    }, [constraints.current])

    return <Modal
        open={open}
        onClose={onClose}
        color="white"
        className="w-full h-full bg-white p-20"
    >
        <div
            className="h-full w-full bg-white"
        >
            <button className="p-5" onClick={() => editor.setType(EditorType.VISUAL)}>Visual</button>
            <button className="p-5" onClick={() => editor.setType(EditorType.CODE)}>Code</button>
            <div
                style={editor.type === EditorType.VISUAL ? {} : {display: 'none'}}
                className="editor bg-white"
                ref={(ref) => ref && setContainer(ref)}
            >
                <div className="container">
                    <div className="node-editor"/>
                </div>
                <div className="dock"/>
            </div>
            <div
                style={editor.type === EditorType.CODE ? {} : {display: 'none'}}
            >
                <CodeEditor/>
            </div>
        </div>
    </Modal>
}