import React, {FC, useContext, useState} from 'react';
import {Arrow, Group, Layer, Line, Rect, Stage, Text} from 'react-konva';
import {CurrentContext, Elem, ElementContext, ElemType} from "./App";
import {KonvaEventObject} from "konva/lib/Node";
import {Modal} from "@mui/material";
import {useRete} from "./rete/useRete";

export const Canvas: FC = () => {
    const [setContainer] = useRete();
    const [open, setOpen] = useState(false);
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
                    <Group
                        onClick={() => setOpen(true)}
                    >
                        <Line
                            points={[elements[0].x, elements[0].y, elements[1].x, elements[1].y]}
                            stroke="red"
                            strokeWidth={5}
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
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                color="white"
                className="w-2/3 h-2/3 bg-white p-20"
            >
                <div
                    style={{
                        width: "20vw",
                        height: "20vh",
                        backgroundColor: "white"
                    }}
                    ref={(ref) => ref && setContainer(ref)}
                />
            </Modal>
        </div>
    );
};