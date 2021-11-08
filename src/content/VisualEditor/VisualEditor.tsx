import {Layer, Line, Stage} from "react-konva"
import {VisualComponent} from "./VisualComponent";
import {useVisual} from "./VisualWrapper";
import {VisualConnection} from "./VisualConnection";
import {useEffect, useState} from "react";
import {Connection} from "../../types";


export const VisualEditor = () => {
    const visual = useVisual();
    const [newConnection, setNewConnection] = useState<Connection | null>(null);

    useEffect(() => {
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
                {newConnection &&
                <Layer>
                    <Line
                    />
                </Layer>
                }
            </Stage>
        </div>
    )
}