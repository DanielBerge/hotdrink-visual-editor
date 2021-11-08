import {Modal} from "@mui/material";
import React, {FC, useEffect} from "react";
import {CodeEditor} from "./CodeEditor";
import {useEditor} from "../wrappers/EditorWrapper";
import {EditorType} from "../types";
import {useConstraints} from "../wrappers/ConstraintsWrapper";
import {VisualEditor} from "./VisualEditor/VisualEditor";
import {VisualWrapper} from "./VisualEditor/VisualWrapper";

interface Props {
    open: boolean;
    onClose: any;
}

export const ConstraintEditor: FC<Props> = ({open, onClose}) => {
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
            >
                <VisualWrapper>
                    <VisualEditor/>
                </VisualWrapper>
            </div>
            <div
                style={editor.type === EditorType.CODE ? {} : {display: 'none'}}
            >
                <CodeEditor/>
            </div>
        </div>
    </Modal>
}