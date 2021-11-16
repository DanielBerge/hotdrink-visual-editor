import {Arrow} from "react-konva";
import {getPoints} from "../../../utils";
import React, {FC} from "react";
import {Constraint} from "../../../types";
import {ElementsWrapperProps} from "../../../wrappers/ElementsWrapper";
import {ConstraintsWrapperProps} from "../../../wrappers/ConstraintsWrapper";

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
        </>
    )
}