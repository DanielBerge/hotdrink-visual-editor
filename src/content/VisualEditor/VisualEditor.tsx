import {Layer, Line, Stage} from "react-konva"
import {VisualComponent} from "./VisualComponent";
import {useVisual} from "./VisualWrapper";
import {VisualConnection} from "./VisualConnection";
import React, {useEffect, useState} from "react";
import {Connection, LibraryComponent} from "../../types";
import {socketYAxisPlacement, upperCaseFirst} from "../../utils";
import {useConstraints} from "../../wrappers/ConstraintsWrapper";
import {useElements} from "../../wrappers/ElementsWrapper";
import {KonvaEventObject} from "konva/lib/Node";

const componentWidth = 150;
const componentHeight = 150;

export const VisualEditor = () => {
    const visual = useVisual();
    const [newConnection, setNewConnection] = useState<Connection | null>(null);
    const [mousePosition, setMousePosition] = useState<{ x: number, y: number } | null>(null);
    const constraints = useConstraints();
    const elements = useElements();
    const [filter, setFilter] = useState<string>("");
    const stageRef = React.useRef(null);
    const [offset, setOffset] = useState<{ x: number, y: number }>({x: 0, y: 0});

    function onMouseMove(e: KonvaEventObject<MouseEvent>) {
        setMousePosition({x: e.evt.clientX - offset.x - 5, y: e.evt.clientY - offset.y - 5});
    }

    useEffect(() => {
        if (stageRef.current) {
            setOffset({
                // @ts-ignore
                x: stageRef?.current.getBoundingClientRect().x,
                // @ts-ignore
                y: stageRef?.current.getBoundingClientRect().y,
            });
        }
    }, [stageRef]);

    useEffect(() => {
        if (newConnection?.fromComponentId && newConnection.toComponentId) {
            visual.setConnections([...visual.connections, newConnection]);
            setNewConnection(null);
        }
    }, [newConnection]);

    useEffect(() => {
        if (visual.components.length === 0) {
            const outPutElem = elements.getElementById(constraints.currentMethod?.toIds[0] ?? "");
            visual.setComponents([
                ...constraints.current?.fromIds.map((id, index) => {
                    const elem = elements.getElementById(id);
                    const type = elem?.type ?? "";
                    return ({
                        id: `${upperCaseFirst(type)}-${id}-${Math.random().toString(36).substring(2, 15)}`,
                        label: `${upperCaseFirst(type)}: ${id}`,
                        x: 100,
                        y: 200 * index + 20,
                        width: componentWidth,
                        height: componentHeight,
                        outputs: [
                            {
                                id: `output-${index}`,
                                variable: id,
                                label: `Output: ${id}`,
                            }
                        ],
                        code: (inputConnections: Connection[], component: any) => {
                            return "";
                        }
                    })
                }) ?? [],
                {
                    id: `${upperCaseFirst(outPutElem?.type ?? "")}-${constraints.currentMethod?.toIds[0]}-${Math.random().toString(36).substring(2, 15)}`,
                    label: ` ${upperCaseFirst(outPutElem?.type ?? "")}: ${constraints.currentMethod?.toIds[0]}`,
                    x: 550,
                    y: 170,
                    width: componentWidth,
                    height: componentHeight,
                    inputs: [
                        {
                            id: `input`,
                            variable: constraints.currentMethod?.toIds[0] ?? "",
                        }
                    ],
                    code: (inputConnections: Connection[], component: any) => {
                        if (inputConnections.length === 1) {
                            return `return ${inputConnections[0].fromSocket?.variable ?? ""};\n`;
                        }
                        return "";
                    }
                } ?? [],
            ]);
        }
    }, [visual.components]);

    return (
        <div className="flex flex-row">
            <div className="w-60 bg-gray p-3">
                <label>Search: </label>
                <input
                    className="border border-black"
                    onChange={(e) => setFilter(e.target.value)}
                />
                <div className="overflow-scroll h-96">
                    {visual.libraryComponents.filter((component) => component.label.toLowerCase().includes(filter.toLowerCase())).map((component: LibraryComponent) => {
                        return (
                            <div
                                key={component.id}
                                style={{width: "100", height: "100", backgroundColor: "gray"}}
                                className="border border-black p-4 m-4 h-32 rounded-lg font-bold"
                                draggable
                                onDragEnd={(e) => {
                                    visual.setComponents([...visual.components, {
                                        ...component,
                                        id: component.id + Math.random().toString(36).substring(2, 15),
                                        width: componentWidth,
                                        height: componentHeight,
                                        x: e.pageX - 400,
                                        y: e.pageY - 200,
                                    }]);
                                }}
                            >
                                {component.label}
                                <div
                                    className={"font-light"}
                                >
                                    {"\nInputs:" + component.inputs?.length}
                                    {"\nOutputs:" + component.outputs?.length}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div
                // @ts-ignore
                ref={(ref) => stageRef.current = ref}
            >
                <Stage
                    width={750}
                    height={500}
                    className="bg-gray-100"
                    onMouseMove={onMouseMove}
                >
                    <Layer>
                        {visual.components.map((component) => {
                            return (
                                <VisualComponent
                                    key={component.id}
                                    component={component}
                                    updateComponent={visual.updateComponent}
                                    deleteComponent={visual.deleteComponent}
                                    setNewConnection={setNewConnection}
                                    connection={newConnection}
                                />
                            )
                        })}
                    </Layer>
                    <Layer>
                        {visual.connections.map((connection, index) => {
                            return (
                                <VisualConnection
                                    key={index}
                                    connection={connection}
                                    getComponentById={visual.getComponentById}
                                    deleteConnection={visual.deleteConnection}
                                />
                            )
                        })}
                        {newConnection && <Line
                            points={[
                                visual.getComponentById(newConnection.fromComponentId ?? "")?.x + visual.getComponentById(newConnection.fromComponentId ?? "")?.width ?? 0,
                                socketYAxisPlacement(visual.getComponentById(newConnection.fromComponentId ?? ""), newConnection.fromSocketIndex!, visual.getComponentById(newConnection.fromComponentId ?? "")?.outputs?.length, true),
                                mousePosition!.x,
                                mousePosition!.y,
                            ]}
                            strokeWidth={6}
                            stroke="black"
                            lineCap="round"
                            lineJoin="round"
                        />}
                    </Layer>
                </Stage>
            </div>
        </div>
    )
}