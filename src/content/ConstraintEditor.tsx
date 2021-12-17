import React, {FC, useEffect} from "react";
import {useEditor} from "../wrappers/EditorWrapper";
import {Connection, EditorType, VComponent} from "../types";
import {useConstraints} from "../wrappers/ConstraintsWrapper";
import {useVisual} from "./VisualEditor/VisualWrapper";
import {VisualEditor} from "./VisualEditor/VisualEditor";
import {CodeEditor} from "./CodeEditor";

interface Props {
    open: boolean;
    onClose: any;
}

export const ConstraintEditor: FC<Props> = ({open, onClose}) => {
    const constraints = useConstraints();
    const editor = useEditor();
    const visual = useVisual();

    const [dialogPosition, setDialogPosition] = React.useState<{ x: number, y: number }>({x: 0, y: 0});


    function generateCode(components: VComponent[], connections: Connection[]): string {
        let code = "";
        components.sort((a, b) => {
            if (a.x < b.x) {
                return -1;
            }
            if (a.x > b.x) {
                return 1;
            }
            return 0;
        }).forEach((component: VComponent) => {
            const compConnections = connections.filter((connection: Connection) => {
                return connection.toComponentId === component.id;
            });
            if (compConnections.length > 0) {
                code += component.code(compConnections, component);
            }
        })

        return code;
    }

    useEffect(() => {
        editor.setType(constraints.currentMethod?.type ?? EditorType.VISUAL);
        visual.fromObject(constraints.currentMethod?.visualJson);
    }, [constraints.currentMethod]);

    return (
        <>
            {open && constraints.current &&
                <div style={{
                    left: 200,
                    top: 200,
                    width: "1000px",
                    height: "600px",
                    position: "fixed",
                    backgroundColor: "white",
                    zIndex: 1,
                }}
                >
                    <div
                        className="bg-white"
                    >
                        <div className="bg-gray-200">
                            <button className="p-5" onClick={() => editor.setType(EditorType.VISUAL)}>Visual</button>
                            <button className="p-5" onClick={() => editor.setType(EditorType.CODE)}>Code</button>
                            <button className="p-5 float-right text-red-600" onClick={() => {
                                if (constraints.currentMethod?.type === EditorType.VISUAL) {
                                    const code = generateCode(visual.components ?? [], visual.connections ?? []);
                                    console.log(code);
                                    if (constraints.current && constraints.currentMethod) {
                                        constraints.updateMethod(constraints.currentMethod, {
                                            ...constraints.currentMethod,
                                            code,
                                            visualJson: visual.toObject()
                                        }, constraints.current);
                                    }
                                    visual.setConnections([]);
                                    visual.setComponents([]);
                                    constraints.setCurrent(undefined);
                                    constraints.setCurrentMethod(undefined);
                                }
                                onClose();
                            }

                            }>SAVE
                            </button>
                        </div>
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
                </div>
            }
        </>
    )
    /**
     return <Modal
     open={open}
     draggable
     onClose={() => {
            if (constraints.currentMethod?.type === EditorType.VISUAL) {
                const code = generateCode(visual.components ?? [], visual.connections ?? []);
                console.log(code);
                if (constraints.current && constraints.currentMethod) {
                    constraints.updateMethod(constraints.currentMethod, {
                        ...constraints.currentMethod,
                        code,
                        visualJson: visual.toObject()
                    }, constraints.current);
                }
                visual.setConnections([]);
                visual.setComponents([]);
                constraints.setCurrent(undefined);
                constraints.setCurrentMethod(undefined);
            }
            onClose();
        }}
     className="bg-transparent m-40"
     >
     <div
     className="bg-white"
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
     **/
}