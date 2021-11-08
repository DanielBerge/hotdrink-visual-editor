import {VComponent, Connection, Socket} from "../../types";
import {FC} from "react";
import {Group, Rect} from "react-konva";
import Konva from "konva";
import {ComponentSocket} from "./ComponentSocket";

interface Props {
    component: VComponent;
    updateComponent: (oldComponent: VComponent, newComponent: VComponent) => void;
    setNewConnection: (connection: Connection) => void;
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
                fill="red"
                draggable
                onDragMove={onDragMove}
                cornerRadius={10}
            />
            {component.inputs?.map((input: Socket, index) => {
                return <ComponentSocket
                    component={component}
                    input={input}
                    index={index}
                    output={false}
                    setNewConnection={setNewConnection}
                    connection={connection}
                />
            })}
            {component.outputs?.map((output: Socket, index) => {
                return <ComponentSocket
                    component={component}
                    input={output}
                    index={index}
                    output={true}
                    setNewConnection={setNewConnection}
                    connection={connection}
                />
            })}
        </Group>
    )
}