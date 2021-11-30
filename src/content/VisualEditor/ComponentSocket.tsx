import {Circle, Text} from "react-konva";
import {FC} from "react";
import {Connection, Socket, VComponent} from "../../types";
import {socketYAxisPlacement} from "../../utils";

const labelPadding = 15;

interface Props {
    component: VComponent;
    socket: Socket;
    index: number;
    output: boolean;
    connection: Connection | null;
    setNewConnection: (connection: Connection | null) => void;
}

export const ComponentSocket: FC<Props> = ({component, socket, index, output, setNewConnection, connection}) => {
    return (
        <>
            <Circle
                x={output ? component.width : 0}
                y={socketYAxisPlacement(component, index, output ? component.outputs?.length : component.inputs?.length)}
                radius={10}
                fill="green"
                onClick={() => {
                    if (connection?.fromComponentId === component.id) {
                        setNewConnection(null);
                    } else if (connection?.fromComponentId && !output) {
                        setNewConnection(
                            {
                                ...connection,
                                toComponentId: component.id,
                                toSocketIndex: index,
                                toSocket: socket,
                            }
                        )
                    } else if (output) {
                        setNewConnection(
                            {
                                ...connection,
                                fromComponentId: component.id,
                                fromSocketIndex: index,
                                fromSocket: socket,
                            }
                        )
                    }
                }}
            />
            <Text
                text={socket.variable}
                x={output ? component.width + labelPadding : labelPadding}
                y={socketYAxisPlacement(component, index, output ? component.outputs?.length : component.inputs?.length)}
            />
        </>
    )
}