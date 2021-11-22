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
    const [multiWay, setMultiWay] = React.useState<string[]>([]);

    useEffect(() => {
        const multiArr = constraint.fromIds.filter((id) => constraint.toIds.includes(id));
        const fromArr = constraint.fromIds.filter((id) => !constraint.toIds.includes(id));
        const toArr = constraint.toIds.filter((id) => !constraint.fromIds.includes(id));
        setMultiWay(multiArr);
        setFromOneWay(fromArr);
        setToOneWay(toArr);

    }, [constraint]);

    return (
        <>
            {
                fromOneWay.map((fromId: string) => {
                    const from = elements.getElementById(fromId);
                    if (from === undefined) {
                        console.error(`Constraint id, does not have matching canvas element: ${fromId}`)
                        return null;
                    }
                    return (
                        <CanvasConstraintArrow
                            key={`From${from.id}`}
                            id={`From${from.id}`}
                            constraints={constraints}
                            constraint={constraint}
                            points={getPoints(from, constraint)}
                            elements={elements}
                            multiway={false}
                            selected={constraints.current === constraint}
                            hidden={false}
                        />
                    )
                })
            }
            {
                toOneWay.map((toId: string) => {
                    const to = elements.getElementById(toId);
                    if (to === undefined) {
                        console.error(`Constraint id, does not have matching canvas element: ${toId}`)
                        return null;
                    }
                    return (
                        <CanvasConstraintArrow
                            key={`To${to.id}`}
                            id={`To${to.id}`}
                            constraints={constraints}
                            constraint={constraint}
                            points={getPoints(constraint, to)}
                            elements={elements}
                            multiway={false}
                            selected={constraints.current === constraint}
                            hidden={constraints.currentMethod?.outputId !== to.id ?? false}
                        />
                    )
                })
            }
            {
                multiWay.map((connection: string) => {
                    const conn = elements.getElementById(connection);
                    if (conn === undefined) {
                        console.error(`Constraint id, does not have matching canvas element: ${connection}`)
                        return null;
                    }
                    return (
                        <CanvasConstraintArrow
                            key={`Multiway${conn.id}`}
                            id={`Multiway${conn.id}`}
                            constraints={constraints}
                            constraint={constraint}
                            points={getPoints(constraint, conn)}
                            elements={elements}
                            multiway={true}
                            selected={constraints.current === constraint}
                            hidden={constraints.currentMethod?.outputId !== connection ?? false}
                        />
                    )
                })
            }
        </>
    )
}