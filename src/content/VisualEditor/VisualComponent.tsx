import {Connection, Socket, VComponent} from "../../types";
import {ChangeEvent, FC} from "react";
import {Group, Rect, Shape, Text} from "react-konva";
import Konva from "konva";
import {ComponentSocket} from "./ComponentSocket";
import {Html} from "react-konva-utils";

interface Props {
    component: VComponent;
    updateComponent: (oldComponent: VComponent, newComponent: VComponent) => void;
    deleteComponent: (component: VComponent) => void;
    setNewConnection: (connection: Connection | null) => void;
    connection: Connection | null;
}


export const VisualComponent: FC<Props> = ({
                                               component,
                                               updateComponent,
                                               deleteComponent,
                                               setNewConnection,
                                               connection
                                           }) => {
    function onDragMove(e: Konva.KonvaEventObject<DragEvent>) {
        updateComponent(component, {
            ...component,
            x: e.target.x(),
            y: e.target.y(),
        })
    }

    function onValueChange(e: ChangeEvent<HTMLInputElement>) {
        updateComponent(component, {
            ...component,
            value: e.target.value,
        })
    }
    return (
        <Group
            x={component.x}
            y={component.y}
            draggable
            onDragMove={onDragMove}
        >
            {component.params && component.params.length > 0 && component.inputs?.length === 1 &&
                <Html
                    divProps={{style: {pointerEvents: 'none'}}}
                    children={<input
                        value={component.value}
                        onChange={onValueChange}
                        placeholder={component.params[0]?.name}
                        type={component.params[0]?.type}
                        style={{width: 100, marginLeft: component.width / 4, marginTop: component.height / 2, pointerEvents: 'all'}}
                    />}
                />}
            <Rect
                width={component.width}
                height={component.height}
                fill="white"
                shadowColor={'gray'}
                shadowBlur={2}
                cornerRadius={10}
            />
            <Group>
                <Text
                    x={10}
                    y={10}
                    fill={'gray'}
                    fontStyle={'bold'}
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
            <Shape
                x={component.width}
                y={0}
                fill={"red"}
                stroke={"red"}
                strokeWidth={5}
                sceneFunc={(context, shape) => {
                    context.beginPath();
                    context.moveTo(0, 0);
                    context.lineTo(-10, 10);
                    context.moveTo(-10, 0);
                    context.lineTo(0, 10);
                    context.closePath();
                    context.fillStrokeShape(shape);
                }}
                onClick={() => {
                    deleteComponent(component);
                }}
            />
        </Group>
    )
}