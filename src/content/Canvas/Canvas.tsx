import React, {FC, useState} from 'react';
import {Layer, Stage} from 'react-konva';
import {KonvaEventObject} from "konva/lib/Node";
import {Constraint, EditorType, Elem, ElemType} from "../../types";
import {useElements} from "../../wrappers/ElementsWrapper";
import {useConstraints} from "../../wrappers/ConstraintsWrapper";
import {ConstraintEditor} from "../ConstraintEditor";
import {CanvasInput} from "./CanvasInput";
import {CanvasButton} from "./CanvasButton";
import {CanvasText} from "./CanvasText";
import {VisualWrapper} from '../VisualEditor/VisualWrapper';
import {CanvasGrid} from "./CanvasGrid";
import {CanvasConstraints} from "./Constraints/CanvasConstraints";
import {HEIGHT, restrictPlacement, restrictSize, WIDTH} from "./canvasUtils";

let constraintIds: Array<string> = [];
let selectedConstraint: Constraint | undefined;

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
            constraints.setCurrent(undefined);
        }
    };

    return (
        <div className="">
            <Stage
                width={WIDTH}
                height={HEIGHT}
                className="bg-gray-100"
                onClick={checkDeselect}
            >
                <CanvasGrid/>
                <CanvasConstraints onClick={onClick} setOpen={setOpen} elements={elements} constraints={constraints}/>
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