import {VComponent, Connection, Socket} from "../../types";
import {FC} from "react";
import {Group, Rect, Text} from "react-konva";
import Konva from "konva";
import {ComponentSocket} from "./ComponentSocket";

interface Props {
    component: VComponent;
    updateComponent: (oldComponent: VComponent, newComponent: VComponent) => void;
    setNewConnection: (connection: Connection | null) => void;
    connection: Connection | null;
}


export const VisualComponent: FC<Props> = ({component, updateComponent, setNewConnection, connection}) => {
    function onDragMove(e: Konva.KonvaEventObject<DragEvent>) {
        updateComponent(component, {
            ...component,
            x: e.target.x(),
            y: e.target.y(),
        })
    }

    return (
        <Group>
            <Rect
                x={component.x}
                y={component.y}
                width={component.width}
                height={component.height}
                fill="gray"
                strokeWidth={1}
                stroke={'black'}
                draggable
                onDragMove={onDragMove}
                cornerRadius={10}
            />
            <Text
                x={component.x + component.width / 3}
                y={component.y + 10}
                fill={'black'}
                text={component.label}
                fontSize={20}
            />
            {component.inputs?.map((input: Socket, index) => {
                return <ComponentSocket
                    key={index}
                    component={component}
                    socket={input}
                    index={index}
                    output={false}
                    setNewConnection={setNewConnection}
                    connection={connection}
                />
            })}
            {component.outputs?.map((output: Socket, index) => {
                return <ComponentSocket
                    key={index}
                    component={component}
                    socket={output}
                    index={index}
                    output={true}
                    setNewConnection={setNewConnection}
                    connection={connection}
                />
            })}
        </Group>
    )
}