import React, {FC, useState} from 'react';
import {Arrow, Group, Layer, Line, Rect, Stage, Text} from 'react-konva';
import {KonvaEventObject} from "konva/lib/Node";
import {Modal} from "@mui/material";
import {useRete} from "../rete/useRete";
import {Constraint, Elem, ElemType} from "../types";
import {useElements} from "../wrappers/ElementsWrapper";
import {useConstraints} from "../wrappers/ConstraintsWrapper";

let constraintIds: Array<string> = [];

export const Canvas: FC = () => {
    const [setContainer, setConstraint, onVisualClose] = useRete();
    const [open, setOpen] = useState(false);
    const elements = useElements();
    const constraints = useConstraints();

    function onClose() {
        setOpen(false);
        onVisualClose();
    }

    function onClick(element: Elem) {
        if (constraints.newConstraint) {
            if (constraintIds.length < 2) {
                constraintIds.push(element.id);
            }
            if (constraintIds.length === 2) {
                constraints.setNewConstraint(false);
                constraints.setConstraints([
                    ...constraints.constraints,
                    {
                        fromId: constraintIds[0],
                        toId: constraintIds[1],
                        code: "",
                    }
                ])
                constraintIds = [];
            }
        }
        elements.setCurrent(element);
    }

    function onDragEnd(e: KonvaEventObject<DragEvent>, elem: Elem) {
        elements.updateElement(elem, {
            ...elem,
            x: e.target.x(),
            y: e.target.y(),
        })
        elements.setCurrent(elem);
    }

    return (
        <div className="">
            <Stage
                width={1000}
                height={window.innerHeight}
                className="bg-gray-100"
            >
                <Layer>
                    {constraints.constraints.map((constraint: Constraint) => {
                        const from = elements.getElementById(constraint.fromId)
                        const to = elements.getElementById(constraint.toId);
                        if (to === undefined || from === undefined) {
                            console.error(`Constraint ids, does not have matching elements: ${constraint.fromId} -> ${constraint.toId}`)
                            return null;
                        }
                        return (
                            <Group
                                key={from.id + to.id}
                                onClick={() => {
                                    setOpen(true)
                                    setConstraint(constraint);
                                }}
                            >
                                <Line
                                    points={[from.x, from.y, to.x, to.y]}
                                    stroke="red"
                                    strokeWidth={5}
                                />
                                <Arrow
                                    points={[to.x, to.y]}
                                    stroke="red"
                                    fill="red"
                                />
                            </Group>
                        )
                    })}
                </Layer>
                <Layer>
                    {elements.elements.map((element: Elem, key: number) => {
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
                            case ElemType.Text:
                                return (
                                    <Text
                                        key={key}
                                        text={element.value}
                                        fill="black"
                                        align="center"
                                        width={element.width}
                                        height={element.height}
                                        padding={15}
                                        fontSize={16}
                                        draggable
                                        x={element.x}
                                        y={element.y}
                                        onClick={() => onClick(element)}
                                        onDragEnd={(e) => onDragEnd(e, element)}
                                    />
                                )
                            default:
                                return null;
                        }
                    })}
                </Layer>
            </Stage>
            <Modal
                open={open}
                onClose={onClose}
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