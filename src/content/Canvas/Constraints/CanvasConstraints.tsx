import React, {FC} from "react";
import {Group, Layer, Rect} from "react-konva";
import {Constraint, Elem} from "../../../types";
import {CanvasConstraintRect} from "./CanvasConstraintRect";
import {ConstraintsWrapperProps} from "../../../wrappers/ConstraintsWrapper";
import {ElementsWrapperProps} from "../../../wrappers/ElementsWrapper";
import {CanvasConstraintArrows} from "./CanvasConstraintArrows";

interface Props {
    onClick: (element: Elem | Constraint) => void;
    setOpen: (open: boolean) => void;
    constraints: ConstraintsWrapperProps;
    elements: ElementsWrapperProps;
}

export const CanvasConstraints: FC<Props> = ({onClick, setOpen, constraints, elements}) => {

    return (
        <Layer>
            {constraints.constraints.map((constraint: Constraint, index) => {
                return (
                    <Group key={index}>
                        <CanvasConstraintRect
                            constraints={constraints}
                            elements={elements}
                            onClick={onClick}
                            constraint={constraint}
                            selected={constraint === constraints.current}
                        />
                        {constraint.methods.map((method, index) => {
                            return <Rect
                                key={method.id}
                                x={constraint.x + constraint.width / 4}
                                y={constraint.y + index * 30 + 10}
                                width={constraint.width / 2}
                                cornerRadius={20}
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
                        <CanvasConstraintArrows constraint={constraint} elements={elements} constraints={constraints}/>
                    </Group>
                )
            })}
        </Layer>
    )

}