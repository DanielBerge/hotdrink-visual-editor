import {Modal} from "@mui/material";
import React, {FC, useState} from "react";
import {CodeEditor} from "./CodeEditor";

interface Props {
    open: boolean;
    onClose: any;
    setContainer: any;
}

enum EditorType {
    CODE,
    VISUAL
}

export const ConstraintEditor: FC<Props> = ({open, onClose, setContainer}) => {
    const [editorType, setEditorType] = useState(EditorType.VISUAL);

    return <Modal
        open={open}
        onClose={onClose}
        color="white"
        className="w-full h-full bg-white p-20"
    >
        <div
            className="h-full w-full bg-white"
        >
            <button className="p-5" onClick={() => setEditorType(EditorType.VISUAL)}>Visual</button>
            <button className="p-5" onClick={() => setEditorType(EditorType.CODE)}>Code</button>
            <div
                style={editorType === EditorType.VISUAL ? {} : {display: 'none'}}
                className="editor bg-white"
                ref={(ref) => ref && setContainer(ref)}
            >
                <div className="container">
                    <div className="node-editor"/>
                </div>
                <div className="dock"/>
            </div>
            <div
                style={editorType === EditorType.CODE ? {} : {display: 'none'}}
            >
                <CodeEditor/>
            </div>
        </div>
    </Modal>
}