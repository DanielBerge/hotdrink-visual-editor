import React, {FC, useState} from 'react';
import {Arrow, Group, Layer, Rect, Stage, Text} from 'react-konva';
import {KonvaEventObject} from "konva/lib/Node";
import {useRete} from "../rete/useRete";
import {Constraint, EditorType, Elem, ElemType} from "../types";
import {useElements} from "../wrappers/ElementsWrapper";
import {useConstraints} from "../wrappers/ConstraintsWrapper";
import {ConstraintEditor} from "./ConstraintEditor";
import {getPoints} from "../utils";

let constraintIds: Array<string> = [];

export const Canvas: FC = () => {
    const elements = useElements();
    const constraints = useConstraints();

    const [setContainer, onVisualClose] = useRete();
    const [open, setOpen] = useState(false);

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
                        type: EditorType.VISUAL,
                        code: "",
                    }
                ])
                constraintIds = [];
            }
        }
        elements.setCurrent(element);
    }

    function onDragMove(e: KonvaEventObject<DragEvent>, elem: Elem) {
        const found = elements.getElementById(elem.id);
        if (found) {
            elements.updateElement(found, {
                    ...found,
                    x: e.target.x(),
                    y: e.target.y(),
                }
            )
            elements.setCurrent(found);
        } else {
            throw new Error("Could not find element to move");
        }
    }

    return (
        <div className="">
            <Stage
                width={window.screen.availWidth - 600}
                height={window.innerHeight}
                className="bg-gray-100"
            >
                <Layer>
                    {constraints.constraints.map((constraint: Constraint) => {
                        const from = elements.getElementById(constraint.fromId);
                        const to = elements.getElementById(constraint.toId);
                        if (to === undefined || from === undefined) {
                            console.error(`Constraint ids, does not have matching canvas elements: ${constraint.fromId} -> ${constraint.toId}`)
                            return null;
                        }

                        return (
                            <Arrow
                                key={from.id + to.id}
                                onClick={() => {
                                    setOpen(true)
                                    constraints.setCurrent(constraint);
                                }}
                                points={getPoints(from, to)}
                                stroke="red"
                                fill="red"
                                strokeWidth={5}
                            />
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
                                        onDragMove={(e) => onDragMove(e, element)}
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
                                        onDragMove={(e) => onDragMove(e, element)}
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
                                        onDragMove={(e) => onDragMove(e, element)}
                                    />
                                )
                            default:
                                return null;
                        }
                    })}
                </Layer>
            </Stage>
            <ConstraintEditor
                onClose={onClose}
                open={open}
                setContainer={setContainer}
            />
        </div>
    );
};