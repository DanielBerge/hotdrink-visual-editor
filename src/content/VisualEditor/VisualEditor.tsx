import {Layer, Line, Stage} from "react-konva"
import {VisualComponent} from "./VisualComponent";
import {useVisual} from "./VisualWrapper";
import {VisualConnection} from "./VisualConnection";
import {useEffect, useState} from "react";
import {Connection, LibraryComponent, VComponent} from "../../types";
import {socketYAxisPlacement} from "../../utils";


export const VisualEditor = () => {
    const visual = useVisual();

    const [newConnection, setNewConnection] = useState<Connection | null>(null);
    const [mousePosition, setMousePosition] = useState<{ x: number, y: number } | null>(null);

    useEffect(() => {
        window.onmousemove = (e) => {
            setMousePosition({x: e.clientX, y: e.clientY});
        };
    }, [])

    useEffect(() => {
        if (newConnection?.fromComponentId && newConnection.toComponentId) {
            visual.setConnections([...visual.connections, newConnection]);
            setNewConnection(null);
        }
    }, [newConnection]);

    return (
        <div className="flex flex-row">
            <div className="w-60 h-40 bg-gray -700 p-3">
                {visual.libraryComponents.map((component: LibraryComponent) => {
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
                    {newConnection &&
                    <Layer>
                        <Line
                            points={[
                                visual.getComponentById(newConnection.fromComponentId ?? "")?.x ?? 0,
                                socketYAxisPlacement(visual.getComponentById(newConnection.fromComponentId ?? ""), newConnection.fromSocketIndex!, visual.getComponentById(newConnection.fromComponentId ?? "")?.outputs?.length),
                                mousePosition?.x ?? 0,
                                mousePosition?.y ?? 0
                            ]}
                            strokeWidth={3}
                            fill={"black"}
                        />
                    </Layer>
                    }
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
                    </Layer>
                </Stage>
            </div>
        </div>
    )
}