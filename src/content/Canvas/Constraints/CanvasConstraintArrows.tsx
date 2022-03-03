import React, {FC, useEffect} from "react";
import {Constraint} from "../../../types";
import {ElementsWrapperProps} from "../../../wrappers/ElementsWrapper";
import {ConstraintsWrapperProps} from "../../../wrappers/ConstraintsWrapper";
import {CanvasConstraintArrow} from "./CanvasConstraintArrow";
import {getPoints} from "../canvasUtils";

interface Props {
    constraint: Constraint;
    elements: ElementsWrapperProps;
    constraints: ConstraintsWrapperProps;
}

export const CanvasConstraintArrows: FC<Props> = ({constraint, elements, constraints}) => {
    const [fromOneWay, setFromOneWay] = React.useState<string[]>([]);
    const [toOneWay, setToOneWay] = React.useState<string[]>([]);

    useEffect(() => {
        const fromArr = constraint.fromIds.filter((id) =>
            !constraint.methods.some((method) =>
                method.toIds.includes(id)));
        const toArr = constraint.methods.map((method) =>
            method.toIds).flat();
        setFromOneWay(fromArr);
        setToOneWay(toArr);

    }, [constraint]);

    return (
        <>
            {
                fromOneWay.map((fromId: string) => {
                    const fromElem = elements.getElementById(fromId);
                    if (fromElem === undefined) {
                        console.error(`Constraint id, does not have matching canvas element: ${fromId}`)
                        return null;
                    }
                    return (
                        <CanvasConstraintArrow
                            key={`From${fromElem.id}`}
                            id={`From${fromElem.id}`}
                            constraints={constraints}
                            constraint={constraint}
                            points={getPoints(fromElem, constraint)}
                            elements={elements}
                            connection={true}
                            selected={constraints.current === constraint}
                            hidden={constraints.current !== constraint ?? false}
                        />
                    )
                })
            }
            {
                toOneWay.map((toId: string) => {
                    const toElem = elements.getElementById(toId);
                    if (toElem === undefined) {
                        console.error(`Constraint id, does not have matching canvas element: ${toId}`)
                        return null;
                    }
                    return (
                        <CanvasConstraintArrow
                            key={`To${toElem.id}`}
                            id={`To${toElem.id}`}
                            constraints={constraints}
                            constraint={constraint}
                            points={getPoints(constraint, toElem)}
                            elements={elements}
                            connection={false}
                            selected={constraints.current === constraint}
                            hidden={!constraints.currentMethod?.toIds.includes(toElem.id) ?? false}
                        />
                    )
                })
            }
        </>
    )
}