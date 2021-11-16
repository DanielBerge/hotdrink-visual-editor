import React, {FC, useState} from 'react';
import {Arrow, Group, Layer, Line, Rect, Stage} from 'react-konva';
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
let selectedConstraint: Constraint | undefined;

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


    function onClick(element: Elem | Constraint) {
        let pushed = false;
        if (constraints.newConstraint) {
            if (constraintIds.length < 2 || selectedConstraint === undefined) {
                if ("type" in element) {
                    constraintIds.push(element.id);
                    pushed = true;
                } else {
                    selectedConstraint = element;
                }
            }
            if (constraintIds.length === 2) {
                constraints.setNewConstraint(false);
                const foundInverseConstraint = constraints.constraints.find((constraint) => constraint.toIds.includes(constraintIds[0]) && constraint.fromIds.includes(constraintIds[1]));
                const foundExactConstraint = constraints.constraints.find((constraint) => constraint.fromIds.includes(constraintIds[0]) && constraint.toIds.includes(constraintIds[1]));
                if (foundInverseConstraint && !foundExactConstraint) {
                    console.log("Found constraint");
                    constraints.updateConstraint(foundInverseConstraint, {
                        ...foundInverseConstraint,
                        fromIds: [...foundInverseConstraint.fromIds, constraintIds[0]],
                        toIds: [...foundInverseConstraint.toIds, constraintIds[1]],
                        methods: [...foundInverseConstraint.methods, {
                            id: `${constraintIds[1]}`,
                            code: "",
                            type: EditorType.VISUAL,
                            outputIds: [constraintIds[1]],
                        }]
                    });
                } else if (!foundExactConstraint) {
                    constraints.setConstraints([
                        ...constraints.constraints,
                        {
                            x: 0,
                            y: 0,
                            width: 100,
                            height: 100,
                            fromIds: [constraintIds[0]],
                            toIds: [constraintIds[1]],
                            methods: [
                                {
                                    id: `${constraintIds[1]}`,
                                    code: "",
                                    type: EditorType.VISUAL,
                                    outputIds: [constraintIds[1]],
                                }
                            ],
                        }
                    ])
                } else {
                    console.warn("Tried to create already existing constraint, aborting");
                }
                constraintIds = [];
            } else if (constraintIds.length === 1 && selectedConstraint !== undefined) {
                constraints.setNewConstraint(false);
                if (pushed) {
                    constraints.setCurrent(
                        constraints.updateConstraint(selectedConstraint, {
                            ...selectedConstraint,
                            toIds: [...selectedConstraint.toIds, ...constraintIds],
                            methods: [...selectedConstraint.methods, {
                                id: `${constraintIds[0]}`,
                                code: "",
                                type: EditorType.VISUAL,
                                outputIds: [constraintIds[0]],
                            }]
                        }));
                } else {
                    constraints.setCurrent(
                        constraints.updateConstraint(selectedConstraint, {
                            ...selectedConstraint,
                            fromIds: [...selectedConstraint.fromIds, ...constraintIds],
                        }));
                }
                constraintIds = [];
                selectedConstraint = undefined;
            }
        }
        if ("type" in element) {
            elements.setCurrent(element);
            constraints.setCurrent(undefined);
        } else {
            constraints.setCurrent(element);
            elements.setCurrent(undefined);
        }
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

    function onDragConstraintMove(e: KonvaEventObject<DragEvent>, constraint: Constraint) {
        constraints.setCurrent(
            constraints.updateConstraint(constraint, {
                ...constraint,
                x: e.target.x(),
                y: e.target.y(),
            })
        )
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
                        return (
                            <Group>
                                <Rect
                                    x={constraint.x}
                                    y={constraint.y}
                                    width={constraint.width}
                                    height={constraint.height}
                                    onClick={() => {
                                        constraints.setCurrent(constraint);
                                        elements.setCurrent(undefined);
                                        onClick(constraint);
                                    }}
                                    fill="red"
                                    onDragMove={(e) => onDragConstraintMove(e, constraint)}
                                    draggable
                                />
                                {constraint.methods.map((method, index) => {
                                    return <Rect
                                        key={method.id}
                                        x={constraint.x}
                                        y={constraint.y + index * 30}
                                        width={constraint.width / 2}
                                        height={20}
                                        fill={"green"}
                                        onClick={() => {
                                            setOpen(true)
                                            constraints.setCurrent(constraint);
                                            constraints.setCurrentMethod(method);
                                            elements.setCurrent(undefined);
                                        }}
                                    />
                                })}
                                {
                                    constraint.fromIds.map((fromId: string) => {
                                        const from = elements.getElementById(fromId);
                                        if (from === undefined) {
                                            console.error(`Constraint id, does not have matching canvas element: ${fromId}`)
                                            return null;
                                        }
                                        return (
                                            <Arrow
                                                key={"From" + from.id}
                                                onClick={() => {
                                                    constraints.setCurrent(constraint);
                                                    elements.setCurrent(undefined);
                                                }}
                                                points={getPoints(from, constraint)}
                                                stroke="red"
                                                fill="red"
                                                strokeWidth={5}
                                            />
                                        )
                                    })
                                }
                                {
                                    constraint.toIds.map((toId: string) => {
                                        const to = elements.getElementById(toId);
                                        if (to === undefined) {
                                            console.error(`Constraint id, does not have matching canvas element: ${toId}`)
                                            return null;
                                        }
                                        return (
                                            <Arrow
                                                key={"To" + to.id}
                                                onClick={() => {
                                                    constraints.setCurrent(constraint);
                                                    elements.setCurrent(undefined);
                                                }}
                                                points={getPoints(constraint, to)}
                                                stroke="red"
                                                fill="red"
                                                strokeWidth={5}
                                            />
                                        )
                                    })
                                }
                            </Group>
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