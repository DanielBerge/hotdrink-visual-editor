import React, {FC} from "react";
import {Group, Layer} from "react-konva";
import {Constraint, Elem} from "../../../types";
import {CanvasConstraintRect} from "./CanvasConstraintRect";
import {ConstraintsWrapperProps} from "../../../wrappers/ConstraintsWrapper";
import {ElementsWrapperProps} from "../../../wrappers/ElementsWrapper";
import {CanvasConstraintArrows} from "./CanvasConstraintArrows";
import {CanvasMethodCircle} from "./CanvasMethodCircle";

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
                            return <CanvasMethodCircle
                                key={index}
                                setOpen={setOpen}
                                constraint={constraint}
                                constraints={constraints}
                                elements={elements}
                                method={method}
                                index={index}
                            />
                        })}
                        <CanvasConstraintArrows constraint={constraint} elements={elements} constraints={constraints}/>
                    </Group>
                )
            })}
        </Layer>
    )

}