import React, {FC, useState} from 'react';
import {Arrow, Layer, Line, Stage} from 'react-konva';
import {KonvaEventObject} from "konva/lib/Node";
import {Constraint, EditorType, Elem, ElemType} from "../../types";
import {useElements} from "../../wrappers/ElementsWrapper";
import {useConstraints} from "../../wrappers/ConstraintsWrapper";
import {ConstraintEditor} from "../ConstraintEditor";
import {clamp, getPoints} from "../../utils";
import {CanvasInput} from "./CanvasInput";
import {CanvasButton} from "./CanvasButton";
import {CanvasText} from "./CanvasText";
import {VisualWrapper} from '../VisualEditor/VisualWrapper';

let constraintIds: Array<string> = [];

const width = window.screen.availWidth - 600;
const height = window.innerHeight;
const snapSpace = 10;

export const Canvas: FC = () => {
    const elements = useElements();
    const constraints = useConstraints();

    const [open, setOpen] = useState(false);

    function onClose() {
        setOpen(false);
    }


    function onClick(element: Elem) {
        if (constraints.newConstraint) {
            if (constraintIds.length < 2) {
                constraintIds.push(element.id);
            }
            if (constraintIds.length === 2) {
                constraints.setNewConstraint(false);
                if (constraints.constraints.find((constraint) => constraint.fromId === constraintIds[0] && constraint.toId === constraintIds[1]) === undefined) {
                    constraints.setConstraints([
                        ...constraints.constraints,
                        {
                            fromId: constraintIds[0],
                            toId: constraintIds[1],
                            type: EditorType.VISUAL,
                            code: "",
                        }
                    ])
                } else {
                    console.warn("Tried to create already existing constraint, aborting");
                }
                constraintIds = [];
            }
        }
        elements.setCurrent(element);
        constraints.setCurrent(undefined);
    }

    function restrictPlacement(e: any, elem: Elem) {
        e.target.x(clamp(e.target.x(), width - elem.width));
        e.target.x(Math.round(e.target.x() / snapSpace) * snapSpace);
        e.target.y(clamp(e.target.y(), height - elem.height));
        e.target.y(Math.round(e.target.y() / snapSpace) * snapSpace);
    }

    function restrictSize(e: any) {
        e.target.width(Math.round(e.target.width() / snapSpace) * snapSpace);
        e.target.height(Math.round(e.target.height() / snapSpace) * snapSpace);
    }

    function onDragMove(e: KonvaEventObject<DragEvent>, elem: Elem) {
        const found = elements.getElementById(elem.id);
        restrictPlacement(e, elem);
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

    function onTransform(e: KonvaEventObject<Event>, node: any) {
        // @ts-ignore
        const scaleX = node?.scaleX();
        // @ts-ignore
        const scaleY = node?.scaleY();
        // @ts-ignore
        node?.scaleX(1);
        // @ts-ignore
        node?.scaleY(1);

        elements.setCurrent(
            elements.updateElement(elements.current, {
                    ...elements.current,
                    x: e.target.x(),
                    y: e.target.y(),
                    width: Math.max(e.target.width() * scaleX),
                    height: Math.max(e.target.height() * scaleY),
                }
            )
        )
    }

    function onTransformEnd(e: KonvaEventObject<Event>, node: any, elem: Elem) {
        restrictSize(e);
        restrictPlacement(e, elem);
        onTransform(e, node);
    }

    const checkDeselect = (e: any) => {
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            elements.setCurrent(undefined);
        }
    };

    return (
        <div className="">
            <Stage
                width={width}
                height={height}
                className="bg-gray-100"
                onClick={checkDeselect}
            >
                <Layer>
                    {
                        Array.from(Array(height).keys()).filter((i) => i % snapSpace === 0).map((y) => {
                            return (
                                <Line
                                    key={y}
                                    points={[0, y, width, y]}
                                    width={width}
                                    stroke="gray"
                                    strokeWidth={0.5}
                                />
                            )
                        })
                    }
                    {
                        Array.from(Array(width).keys()).filter((i) => i % snapSpace === 0).map((x) => {
                            return (
                                <Line
                                    key={x}
                                    points={[x, 0, x, height]}
                                    width={width}
                                    stroke="gray"
                                    strokeWidth={0.5}
                                />
                            )
                        })
                    }
                </Layer>
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
                                    constraints.setCurrent(constraint);
                                    elements.setCurrent(undefined);
                                }}
                                onDblClick={() => {
                                    setOpen(true)
                                    constraints.setCurrent(constraint);
                                    elements.setCurrent(undefined);
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
                                    <CanvasInput
                                        key={key}
                                        element={element}
                                        onClick={onClick}
                                        onDragMove={onDragMove}
                                        isSelected={element.id === elements.current?.id}
                                        onTransform={onTransform}
                                        onTransformEnd={onTransformEnd}
                                    />
                                )
                            case ElemType.Button:
                                return (
                                    <CanvasButton
                                        key={key}
                                        element={element}
                                        onClick={onClick}
                                        onDragMove={onDragMove}
                                        isSelected={element.id === elements.current?.id}
                                        onTransform={onTransform}
                                        onTransformEnd={onTransformEnd}
                                    />
                                )
                            case ElemType.Text:
                                return (
                                    <CanvasText key={key} element={element} onClick={onClick} onDragMove={onDragMove}/>
                                )
                            default:
                                return null;
                        }
                    })}
                </Layer>
            </Stage>
            <VisualWrapper>
                <ConstraintEditor
                    onClose={onClose}
                    open={open}
                />
            </VisualWrapper>
        </div>
    );
};