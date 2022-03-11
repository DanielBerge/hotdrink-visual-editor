import {Arrow, Group, Line} from "react-konva";
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
    connection: boolean;
    hidden: boolean;
}

export const CanvasConstraintArrow: FC<Props> = ({
                                                     id,
                                                     constraints,
                                                     constraint,
                                                     elements,
                                                     points,
                                                     connection,
                                                     hidden,
                                                     selected
                                                 }) => {

    function chooseOpacityOneWay() {
        if (hidden && constraints.currentMethod) {
            return 0.3;
        }
        return (constraints.current && constraints.current === constraint) ? 1 : 0.3;
    }
    function chooseOpacityTwoWay() {
        if (hidden && constraints.currentMethod) {
            return 0.0;
        }
        return (constraints.current && constraints.current === constraint) ? 1 : 0.3;
    }

    return (
        <>
            {connection ? <Line
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
                    shadowBlur={3}
                    shadowColor={'red'}
                /> :
                <Group>
                    {hidden && constraints.currentMethod && <Line
                        points={points}
                        stroke="red"
                        fill="red"
                        opacity={1}
                        strokeWidth={5}
                        shadowBlur={3}
                        shadowColor={'red'}
                    />}
                    <Arrow
                        key={id}
                        onClick={() => {
                            constraints.setCurrent(constraint);
                            elements.setCurrent(undefined);
                        }}
                        points={points}
                        stroke="red"
                        fill="red"
                        opacity={chooseOpacityTwoWay()}
                        strokeWidth={5}
                        shadowBlur={3}
                        shadowColor={'red'}
                    />
                    {selected && <Line
                        points={points}
                        stroke="red"
                        fill="red"
                        opacity={1}
                        strokeWidth={5}
                        shadowBlur={3}
                        shadowColor={'red'}
                    />}
                </Group>}
        </>
    )
}