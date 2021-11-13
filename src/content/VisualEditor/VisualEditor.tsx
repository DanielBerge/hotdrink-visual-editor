import {Layer, Line, Stage} from "react-konva"
import {VisualComponent} from "./VisualComponent";
import {useVisual} from "./VisualWrapper";
import {VisualConnection} from "./VisualConnection";
import {useEffect, useState} from "react";
import {Connection, LibraryComponent} from "../../types";
import {socketYAxisPlacement} from "../../utils";
import {useConstraints} from "../../wrappers/ConstraintsWrapper";


export const VisualEditor = () => {
    const visual = useVisual();
    const [newConnection, setNewConnection] = useState<Connection | null>(null);
    const [mousePosition, setMousePosition] = useState<{ x: number, y: number } | null>(null);
    const constraints = useConstraints();
    const [filter, setFilter] = useState<string>("");

    useEffect(() => {
        function onMouseMove(e: MouseEvent) {
            setMousePosition({x: e.clientX, y: e.clientY});
        }

        window.addEventListener('mousemove', onMouseMove);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, [newConnection]);

    useEffect(() => {
        if (newConnection?.fromComponentId && newConnection.toComponentId) {
            visual.setConnections([...visual.connections, newConnection]);
            setNewConnection(null);
        }
    }, [newConnection]);

    useEffect(() => {
        if (visual.components.length === 0) {
            visual.setComponents([
                ...constraints.current?.fromIds.map((id, index) => ({
                    id: `input-${id}`,
                    label: `Input: ${id}`,
                    x: 100,
                    y: 220 * index + 20,
                    width: 200,
                    height: 200,
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
                })) ?? [],
                ...constraints.current?.toIds.map((id, index) => ({
                    id: `output-${id}`,
                    label: `Output: ${id}`,
                    x: 700,
                    y: 220 * index + 20,
                    width: 200,
                    height: 200,
                    inputs: [
                        {
                            id: `input-${index}`,
                            variable: id,
                            label: `Input: ${id}`,
                        }
                    ],
                    code: (inputConnections: Connection[], component: any) => {
                        if (inputConnections.length === 1) {
                            return `return ${inputConnections[0].fromSocket?.variable ?? ""};\n`;
                        }
                        return "";
                    }
                })) ?? [],
            ]);
        }
    }, [visual.components]);

    return (
        <div className="flex flex-row">
            <div className="w-60 h-40 bg-gray -700 p-3">
                <label>Search: </label>
                <input
                    className="border border-black"
                    onChange={(e) => setFilter(e.target.value)}
                />
                {visual.libraryComponents.filter((component) => component.label.toLowerCase().includes(filter.toLowerCase())).map((component: LibraryComponent) => {
                    return (
                        <div
                            key={component.id}
                            style={{width: "100", height: "100", backgroundColor: "gray"}}
                            className="border border-black p-4 m-4 h-32 rounded-lg"
                            draggable
                            onDragEnd={(e) => {
                                visual.setComponents([...visual.components, {
                                    ...component,
                                    id: component.id + Math.random().toString(36).substring(2, 15),
                                    width: 200,
                                    height: 200,
                                    x: e.pageX - 400,
                                    y: e.pageY - 200,
                                }]);
                            }}
                        >
                            {component.label}
                        </div>
                    )
                })}
            </div>
            <div>
                <Stage
                    width={window.innerWidth - 400}
                    height={500}
                    className="bg-gray-100"
                >
                    <Layer>
                        {visual.components.map((component) => {
                            return (
                                <VisualComponent
                                    key={component.id}
                                    component={component}
                                    updateComponent={visual.updateComponent}
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
                                />
                            )
                        })}
                        {newConnection && <Line
                            points={[
                                visual.getComponentById(newConnection.fromComponentId ?? "")?.x + visual.getComponentById(newConnection.fromComponentId ?? "")?.width ?? 0,
                                socketYAxisPlacement(visual.getComponentById(newConnection.fromComponentId ?? ""), newConnection.fromSocketIndex!, visual.getComponentById(newConnection.fromComponentId ?? "")?.outputs?.length, true),
                                mousePosition!.x - 330,
                                mousePosition!.y - 145,
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