import React, {FC, useState} from 'react';
import {Layer, Stage} from 'react-konva';
import {KonvaEventObject} from "konva/lib/Node";
import {Constraint, Elem, ElemType} from "../../types";
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

export const Canvas: FC = () => {
        const elements = useElements();
        const constraints = useConstraints();

        const [open, setOpen] = useState(false);

        function onClose() {
            setOpen(false);
        }

        function onClickConstraint(constraint: Constraint) {
            constraints.setCurrent(constraint);
            elements.setCurrent(undefined);
        }

        function onClickElem(element: Elem) {
            if (constraints.newMethod && constraints.current?.fromIds.includes(element.id)) {
                constraints.toggleElementToNewConstraint(element.id);
            } else if (constraints.newConstraint) {
                constraints.toggleElementToNewConstraint(element.id);
            } else if (!constraints.newMethod) {
                elements.setCurrent(element);
                constraints.setCurrent(undefined);
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
                constraints.cancelNewConstraint();
                constraints.cancelNewMethod();
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
                    <CanvasConstraints onClick={onClickConstraint} setOpen={setOpen} elements={elements}
                                       constraints={constraints}/>
                    <Layer>
                        {elements.elements.map((element: Elem, key: number) => {
                            switch (element.type) {
                                case ElemType.Input:
                                    return (
                                        <CanvasInput
                                            key={key}
                                            element={element}
                                            onClick={onClickElem}
                                            onDragMove={onDragMove}
                                            isSelected={element.id === elements.current?.id}
                                            onTransform={onTransform}
                                            onTransformEnd={onTransformEnd}
                                            newConstraint={constraints.newConstraint}
                                            newMethod={constraints.newMethod}
                                            currentElements={constraints.currentElements}
                                            currentConstraint={constraints.current}
                                        />
                                    )
                                case ElemType.Button:
                                    return (
                                        <CanvasButton
                                            key={key}
                                            element={element}
                                            onClick={onClickElem}
                                            onDragMove={onDragMove}
                                            isSelected={element.id === elements.current?.id}
                                            onTransform={onTransform}
                                            onTransformEnd={onTransformEnd}
                                            newConstraint={constraints.newConstraint}
                                            newMethod={constraints.newMethod}
                                            currentElements={constraints.currentElements}
                                            currentConstraint={constraints.current}
                                        />
                                    )
                                case ElemType.Text:
                                    return (
                                        <CanvasText
                                            key={key}
                                            element={element}
                                            onClick={onClickElem}
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
    }
;