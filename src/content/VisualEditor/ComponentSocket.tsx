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
    setNewConnection: (connection: Connection) => void;
}

export const ComponentSocket: FC<Props> = ({component, socket, index, output, setNewConnection, connection}) => {
    return (
        <>
            <Circle
                x={output ? component.x + component.width : component.x}
                y={socketYAxisPlacement(component, index)}
                radius={10}
                fill="green"
                onClick={() => {
                    if (connection?.fromComponentId && !output) {
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
                text={socket.label}
                x={output ? component.x + component.width + labelPadding : component.x + labelPadding}
                y={socketYAxisPlacement(component, index)}
            />
        </>
    )
}