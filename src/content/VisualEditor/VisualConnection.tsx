import {FC, useState} from "react";
import {Line} from "react-konva";
import {Connection, VComponent} from "../../types";
import {socketYAxisPlacement} from "../../utils";

interface Props {
    connection: Connection;
    getComponentById: (id: string) => VComponent;
    deleteConnection: (connection: Connection) => void;
}

export const VisualConnection: FC<Props> = ({connection, getComponentById, deleteConnection}) => {
    const [strokeColor, setStrokeColor] = useState("black");
    const fromComponent = getComponentById(connection.fromComponentId ?? "");
    const toComponent = getComponentById(connection.toComponentId ?? "");
    if (fromComponent === undefined || toComponent === undefined) {
        return null;
    }
    return (
        <Line
            onMouseEnter={() => {
                setStrokeColor("red");
            }}
            onMouseLeave={() => {
                setStrokeColor("black");
            }}
            onClick={() => {
                deleteConnection(connection);
            }}
            points={[
                fromComponent.x + fromComponent.width,
                socketYAxisPlacement(fromComponent, connection.fromSocketIndex ?? 0, fromComponent.outputs?.length, true),
                toComponent.x,
                socketYAxisPlacement(toComponent, connection.toSocketIndex ?? 0, toComponent.inputs?.length, true),
            ]}
            stroke={strokeColor}
            strokeWidth={5}
            lineCap="round"
            lineJoin="round"
        />
    )
}