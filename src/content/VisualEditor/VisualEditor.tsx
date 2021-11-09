import {Layer, Line, Stage} from "react-konva"
import {VisualComponent} from "./VisualComponent";
import {useVisual} from "./VisualWrapper";
import {VisualConnection} from "./VisualConnection";
import {useEffect, useState} from "react";
import {Connection, VComponent} from "../../types";
import {socketYAxisPlacement} from "../../utils";


export const VisualEditor = () => {
    const visual = useVisual();

    function generateCode(components: VComponent[], connections: Connection[]): string {
        let code = "";
        components.reverse().forEach((component: VComponent) => {
            const compConnections = connections.filter((connection: Connection) => {
                return connection.toComponentId === component.id;
            });
            code += component.code(compConnections);
        })

        return code;
    }

    const [newConnection, setNewConnection] = useState<Connection | null>(null);
    const [mousePosition, setMousePosition] = useState<{ x: number, y: number } | null>(null);

    useEffect(() => {
        window.onmousemove = (e) => {
            setMousePosition({x: e.clientX, y: e.clientY});
        };
    }, [])

    useEffect(() => {
        console.log(generateCode(visual.components, visual.connections));
        if (newConnection?.fromComponentId && newConnection.toComponentId) {
            console.log(newConnection)
            visual.setConnections([...visual.connections, newConnection]);
            setNewConnection(null);
        }
    }, [newConnection]);

    return (
        <div>
            <Stage
                width={window.innerWidth}
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
    )
}