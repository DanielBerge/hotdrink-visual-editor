import {getPoints} from "../../../utils";
import React, {FC} from "react";
import {Constraint} from "../../../types";
import {ElementsWrapperProps} from "../../../wrappers/ElementsWrapper";
import {ConstraintsWrapperProps} from "../../../wrappers/ConstraintsWrapper";
import {CanvasConstraintArrow} from "./CanvasConstraintArrow";

interface Props {
    constraint: Constraint;
    elements: ElementsWrapperProps;
    constraints: ConstraintsWrapperProps;
}

export const CanvasConstraintArrows: FC<Props> = ({constraint, elements, constraints}) => {
    return (
        <>
            {
                constraint.fromIds.map((fromId: string) => {
                    const from = elements.getElementById(fromId);
                    if (from === undefined) {
                        console.error(`Constraint id, does not have matching canvas element: ${fromId}`)
                        return null;
                    }
                    return (
                        <CanvasConstraintArrow
                            id={`From${from.id}`}
                            constraints={constraints}
                            constraint={constraint}
                            points={getPoints(from, constraint)}
                            elements={elements}
                            selected={constraints.current === constraint}
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
                        <CanvasConstraintArrow
                            id={`To${to.id}`}
                            constraints={constraints}
                            constraint={constraint}
                            points={getPoints(constraint, to)}
                            elements={elements}
                            selected={constraints.current === constraint}
                        />
                    )
                })
            }
        </>
    )
}