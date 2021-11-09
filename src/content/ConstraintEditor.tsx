import {Modal} from "@mui/material";
import React, {FC, useEffect} from "react";
import {CodeEditor} from "./CodeEditor";
import {useEditor} from "../wrappers/EditorWrapper";
import {Connection, EditorType, VComponent} from "../types";
import {useConstraints} from "../wrappers/ConstraintsWrapper";
import {VisualEditor} from "./VisualEditor/VisualEditor";
import {useVisual} from "./VisualEditor/VisualWrapper";

interface Props {
    open: boolean;
    onClose: any;
}

export const ConstraintEditor: FC<Props> = ({open, onClose}) => {
    const constraints = useConstraints();
    const editor = useEditor();
    const visual = useVisual();

    function generateCode(components: VComponent[], connections: Connection[]): string {
        let code = "";
        components.reverse().forEach((component: VComponent) => {
            const compConnections = connections.filter((connection: Connection) => {
                return connection.toComponentId === component.id;
            });
            code += component.code(compConnections, component.outputs ?? []);
        })

        return code;
    }

    useEffect(() => {
        console.log("ConstraintEditor: useEffect");
        console.log(constraints.current?.visualJson);
        editor.setType(constraints.current?.type ?? EditorType.VISUAL);
        visual.fromObject(constraints.current?.visualJson);
    }, [constraints.current])

    return <Modal
        open={open}
        onClose={() => {
            const code = generateCode(visual.components ?? [], visual.connections ?? []);
            console.log(code);
            editor.setCode(code);
            if (constraints.current) {
                constraints.updateConstraint(constraints.current, {
                    ...constraints.current,
                    code: code,
                    type: editor.type,
                    visualJson: visual.toObject(),
                })
            }
            visual.setConnections([]);
            visual.setComponents([]);
            constraints.setCurrent(undefined);
            onClose();
        }}
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
                <VisualEditor/>
            </div>
            <div
                style={editor.type === EditorType.CODE ? {} : {display: 'none'}}
            >
                <CodeEditor/>
            </div>
        </div>
    </Modal>
}