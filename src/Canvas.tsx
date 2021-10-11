import React, {FC, useContext, useState} from 'react';
import {Arrow, Group, Layer, Line, Rect, Stage, Text} from 'react-konva';
import {ConstraintContext, CurrentContext, ElementContext, NewConstraintContext} from "./App";
import {KonvaEventObject} from "konva/lib/Node";
import {Modal} from "@mui/material";
import {useRete} from "./rete/useRete";
import {Constraint, Elem, ElemType} from "./types";

let constraintIds: Array<string> = [];

export const Canvas: FC = () => {
    const [setContainer] = useRete();
    const [open, setOpen] = useState(false);
    const {elements, __, updateElement, getElementById} = useContext(ElementContext);
    const {_, setCurrent} = useContext(CurrentContext);
    const {constraints, setConstraints} = useContext(ConstraintContext);
    const {newConstraint, setNewConstraint} = useContext(NewConstraintContext);

    function onClick(element: Elem) {
        if (newConstraint) {
            if (constraintIds.length < 2) {
                constraintIds.push(element.id);
            }
            if (constraintIds.length === 2) {
                setNewConstraint(false);
                setConstraints([
                    ...constraints,
                    {
                        fromId: constraintIds[0],
                        toId: constraintIds[1],
                        code: "",
                    }
                ])
                constraintIds = [];
            }
        }
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
                    {constraints.map((constraint: Constraint) => {
                        const from = getElementById(constraint.fromId)
                        const to = getElementById(constraint.toId);
                        return (
                            <Group
                                onClick={() => setOpen(true)}
                            >
                                <Line
                                    points={[from.x, from.y, to.x, to.y]}
                                    stroke="red"
                                    strokeWidth={5}
                                />
                                <Arrow
                                    points={[from.x, from.y]}
                                    stroke="red"
                                    fill="red"
                                />
                            </Group>
                        )
                    })}
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