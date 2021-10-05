import React, {FC, useContext} from 'react';
import {Arrow, Group, Layer, Line, Rect, Stage, Text} from 'react-konva';
import {CurrentContext, Elem, ElementContext, ElemType} from "./App";
import {KonvaEventObject} from "konva/lib/Node";

export const Canvas: FC = () => {
    const {elements, __, updateElement} = useContext(ElementContext);
    const {_, setCurrent} = useContext(CurrentContext);

    function onClick(element: Elem) {
        setCurrent(element);
    }

    function onDragEnd(e: KonvaEventObject<DragEvent>, elem: Elem) {
        updateElement(elem, {
            ...elem,
            x: e.target.x(),
            y: e.target.y(),
        })
    }

    return (
        <div className="">
            <Stage
                width={1000}
                height={window.innerHeight}
                className="bg-gray-100"
            >
                <Layer>
                    <Group>
                        <Line

                            points={[elements[0].x, elements[0].y, elements[1].x, elements[1].y]}
                            stroke="red"
                            strokeWidth={2}
                        />
                        <Arrow
                            points={[elements[0].x, elements[0].y]}
                            stroke="red"
                            fill="red"
                        />
                    </Group>
                </Layer>
                <Layer>
                    {elements.map((element: Elem, key: number) => {
                        switch (element.type) {
                            case ElemType.Input:
                                return (
                                    <Rect
                                        key={key}
                                        width={element.width}
                                        height={element.height}
                                        draggable
                                        x={element.x}
                                        y={element.y}
                                        fill="white"
                                        stroke="black"
                                        onClick={() => onClick(element)}
                                        onDragEnd={(e) => onDragEnd(e, element)}
                                    />
                                )
                            case ElemType.Button:
                                return (
                                    <Group
                                        key={key}
                                        x={element.x}
                                        y={element.y}
                                        draggable
                                        onClick={() => onClick(element)}
                                        onDragEnd={(e) => onDragEnd(e, element)}
                                    >
                                        <Rect
                                            width={element.width}
                                            height={element.height}
                                            fill="black"
                                        />
                                        <Text
                                            text={element.value}
                                            fill="white"
                                            align="center"
                                            width={element.width}
                                            padding={15}
                                            fontSize={16}
                                        />
                                    </Group>
                                )
                            default:
                                return null;
                        }
                    })}
                </Layer>
            </Stage>
        </div>
    );
};