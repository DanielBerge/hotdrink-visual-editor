import React, {FC, useState} from 'react';
import {Layer, Stage} from 'react-konva';
import {KonvaEventObject} from "konva/lib/Node";
import {Constraint, EditorType, Elem, ElemType, VMethod} from "../../types";
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
let selectedMethod: VMethod | undefined;

export const Canvas: FC = () => {
    const elements = useElements();
    const constraints = useConstraints();

    const [open, setOpen] = useState(false);

    function onClose() {
        setOpen(false);
    }


    function onClick(element: Elem | Constraint | VMethod) {
        let pushed = false;
        if (constraints.newConstraint) {
            console.log("ONCLICK");
            if (constraintIds.length < 2 || selectedConstraint === undefined || selectedMethod === undefined) {
                if ("binding" in element) {
                    constraintIds.push(element.id);
                    pushed = true;
                } else if ("code" in element) {
                    selectedMethod = element;
                } else {
                    selectedConstraint = element;
                }
            }
            if (constraintIds.length === 2) {
                console.log(constraintIds);
                constraints.setNewConstraint(false);
                const foundInverseConstraint = constraints.constraints.find((constraint) =>
                    constraint.methods.some((method) => method.toIds.includes(constraintIds[0]))
                    && constraint.fromIds.includes(constraintIds[1]));
                const foundExactConstraint = constraints.constraints.find((constraint) =>
                    constraint.fromIds.includes(constraintIds[0])
                    && constraint.methods.some((method) => method.toIds.includes(constraintIds[1])));
                if (foundInverseConstraint && !foundExactConstraint) {
                    console.log("Found constraint");
                    constraints.updateConstraint(foundInverseConstraint, {
                        ...foundInverseConstraint,
                        fromIds: [...foundInverseConstraint.fromIds, constraintIds[0]],
                        methods: [...foundInverseConstraint.methods, {
                            id: `${constraintIds[1]}`,
                            code: "",
                            type: EditorType.VISUAL,
                            toIds: [constraintIds[1]],
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
                            methods: [
                                {
                                    id: `${constraintIds[1]}`,
                                    code: "",
                                    type: EditorType.VISUAL,
                                    toIds: [constraintIds[1]],
                                }
                            ],
                        }
                    ])
                } else {
                    console.warn("Tried to create already existing constraint, aborting");
                }
                constraintIds = [];
            } else if (constraintIds.length === 1 && selectedMethod !== undefined && constraints.current) {
                constraints.setNewConstraint(false);
                constraints.updateConstraint(constraints.current, {
                    ...constraints.current,
                    methods: [...constraints.current.methods.filter((method) => method.id !== selectedMethod?.id), {
                        ...selectedMethod,
                        toIds: [...selectedMethod.toIds, constraintIds[0]]
                    }]
                });
                constraintIds = [];
                selectedMethod = undefined;
            } else if (constraintIds.length === 1 && selectedConstraint !== undefined) {
                constraints.setNewConstraint(false);
                if (pushed) {
                    constraints.setCurrent(
                        constraints.updateConstraint(selectedConstraint, {
                            ...selectedConstraint,
                            methods: [...selectedConstraint.methods, {
                                id: `${constraintIds[0]}`,
                                code: "",
                                type: EditorType.VISUAL,
                                toIds: [constraintIds[0]],
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
        if ("code" in element) {
            //TODO Gjøre noe her?
            //Do nothing
        } else if ("binding" in element) {
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
        if (clickedOnEmpty && !open) {
            elements.setCurrent(undefined);
            constraints.setCurrent(undefined);
            constraints.setCurrentMethod(undefined);
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
                                        newConstraint={constraints.newConstraint}
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
                                        newConstraint={constraints.newConstraint}
                                    />
                                )
                            case ElemType.Text:
                                return (
                                    <CanvasText
                                        key={key}
                                        element={element}
                                        onClick={onClick}
                                        onDragMove={onDragMove}
                                        newConstraint={constraints.newConstraint}
                                    />
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