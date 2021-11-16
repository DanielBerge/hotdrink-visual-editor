import {Arrow} from "react-konva";
import React, {FC} from "react";
import {ConstraintsWrapperProps} from "../../../wrappers/ConstraintsWrapper";
import {Constraint} from "../../../types";
import {ElementsWrapperProps} from "../../../wrappers/ElementsWrapper";

interface Props {
    id: string;
    constraints: ConstraintsWrapperProps;
    constraint: Constraint;
    elements: ElementsWrapperProps;
    points: number[];
    selected: boolean;
}

export const CanvasConstraintArrow: FC<Props> = ({id, constraints, constraint, elements, points, selected}) => {

    return (
        <>
            <Arrow
                key={id}
                onClick={() => {
                    constraints.setCurrent(constraint);
                    elements.setCurrent(undefined);
                }}
                points={points}
                stroke="red"
                fill="red"
                strokeWidth={5}
            />
        </>
    )
}