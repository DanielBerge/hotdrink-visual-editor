import {Circle, Text} from "react-konva";
import {FC} from "react";
import {VComponent, Connection, Socket} from "../../types";
import {socketYAxisPlacement} from "../../utils";

const labelPadding = 15;

interface Props {
    component: VComponent;
    input: Socket;
    index: number;
    output: boolean;
    connection: Connection | null;
    setNewConnection: (connection: Connection) => void;
}

export const ComponentSocket: FC<Props> = ({component, input, index, output, setNewConnection, connection}) => {

    return (
        <>
            <Circle
                x={output ? component.x + component.width : component.x}
                y={socketYAxisPlacement(component, index)}
                radius={10}
                fill="green"
                onClick={() => {
                    console.log("Clicked");
                    if (connection?.fromComponentId) {
                        setNewConnection(
                            {
                                ...connection,
                                toComponentId: component.id,
                                toSocketIndex: index,
                            }
                        )
                    } else {
                        setNewConnection(
                            {
                                ...connection,
                                fromComponentId: component.id,
                                fromSocketIndex: index,
                            }
                        )
                    }
                }}
            />
            <Text
                text={input.label}
                x={output ? component.x + component.width + labelPadding : component.x + labelPadding}
                y={socketYAxisPlacement(component, index)}
            />
        </>
    )
}