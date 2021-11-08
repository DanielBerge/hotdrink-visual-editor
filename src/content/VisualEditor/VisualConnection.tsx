import {FC} from "react";
import {Line} from "react-konva";
import {Connection, VComponent} from "../../types";
import {socketYAxisPlacement} from "../../utils";

interface Props {
    connection: Connection;
    getComponentById: (id: string) => VComponent;
}

export const VisualConnection: FC<Props> = ({connection, getComponentById}) => {
    const fromComponent = getComponentById(connection.fromComponentId ?? "");
    const toComponent = getComponentById(connection.toComponentId ?? "");
    return (
        <Line
            points={[fromComponent.x + fromComponent.width,
                socketYAxisPlacement(fromComponent, connection.fromSocketIndex ?? 0),
                toComponent.x,
                socketYAxisPlacement(toComponent, connection.toSocketIndex ?? 0),
            ]}
            stroke={"black"}
            strokeWidth={2}
            lineCap="round"
            lineJoin="round"
        />
    )
}