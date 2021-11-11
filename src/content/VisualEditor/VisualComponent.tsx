import {Connection, Socket, VComponent} from "../../types";
import {FC} from "react";
import {Group, Rect, Text} from "react-konva";
import Konva from "konva";
import {ComponentSocket} from "./ComponentSocket";
import {Html} from "react-konva-utils";

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

    return <Group
        x={component.x}
        y={component.y}
        draggable
        onDragMove={onDragMove}
    >
        <Html
            children={<input style={{width: 100, marginLeft: component.width / 4, marginTop: component.height / 2}}/>}
        />
        <Rect
            width={component.width}
            height={component.height}
            fill="gray"
            strokeWidth={1}
            stroke={'black'}
            cornerRadius={10}
        />
        <Group>
            <Text
                x={component.width / 3}
                y={10}
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
    </Group>
    /**
     return (
     <Group>
     <Html
     groupProps={{y: component.y - 100, x: component.x}}
     children={<input style={{width: 100, marginLeft: component.width / 4}}/>}
     transform
     transformFunc={(attrs => {
                    return {
                        ...attrs,
                        x: component.x,
                        y: component.y + component.height / 2,
                    }
                })}
     />
     <Rect
     x={component.x}
     y={component.y}
     width={component.width}
     height={component.height}
     fill="gray"
     strokeWidth={1}
     stroke={'black'}
     cornerRadius={10}
     draggable
     onDragMove={onDragMove}
     />
     <Group>
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
     </Group>
     )
     **/
}