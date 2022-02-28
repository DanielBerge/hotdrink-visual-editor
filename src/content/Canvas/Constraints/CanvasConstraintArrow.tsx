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
    multiway: boolean;
    hidden: boolean;
}

export const CanvasConstraintArrow: FC<Props> = ({
                                                     id,
                                                     constraints,
                                                     constraint,
                                                     elements,
                                                     points,
                                                     multiway,
                                                     hidden,
                                                     selected
                                                 }) => {

    function chooseOpacityOneWay() {
        if (hidden && constraints.currentMethod) {
            return 0.3;
        }
        return (constraints.current && constraints.current === constraint) ? 1 : 0.3;
    }

    function chooseOpacityMultiway() {
        if (!selected && constraints.currentMethod) {
            return 0.3;
        }
        return (constraints.current && constraints.current === constraint) ? 1 : 0.3;
    }

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
                opacity={chooseOpacityOneWay()}
                strokeWidth={5}
            />
            {multiway &&
                <Arrow
                    key={`${id}-2`}
                    onClick={() => {
                        constraints.setCurrent(constraint);
                        elements.setCurrent(undefined);
                    }}
                    points={points}
                    stroke="red"
                    fill="red"
                    strokeWidth={5}
                    opacity={chooseOpacityMultiway()}
                    pointerAtBeginning={true}
                />
            }
        </>
    )
}