import React, {FC} from "react";
import {Group, Rect, Text} from "react-konva";
import {Constraint, VMethod} from "../../../types";
import {ConstraintsWrapperProps} from "../../../wrappers/ConstraintsWrapper";
import {ElementsWrapperProps} from "../../../wrappers/ElementsWrapper";

interface Props {
    setOpen: (open: boolean) => void;
    constraint: Constraint;
    constraints: ConstraintsWrapperProps;
    elements: ElementsWrapperProps;
    method: VMethod;
    index: number;
    onClick: (element: any) => void;
}

export const CanvasMethodCircle: FC<Props> = ({setOpen, constraints, constraint, elements, method, index, onClick}) => {
    const [hover, setHover] = React.useState(false);

    return (
        <Group
            x={constraint.x + constraint.width / 4}
            y={constraint.y + index * 30 + 10}
            onClick={() => {
                if (constraints.newConstraint) {
                    onClick(method);
                } else {
                    setOpen(true)
                    constraints.setCurrent(constraint);
                    constraints.setCurrentMethod(method);
                    elements.setCurrent(undefined);
                }
            }}
            onMouseOver={() => {
                constraints.setCurrentMethod(method);
                constraints.setCurrent(constraint);
                elements.setCurrent(undefined);
                setHover(true);
            }}
            onMouseLeave={() => {
                setHover(false);
            }}
        >
            <Rect
                key={method.id}
                width={constraint.width / 2}
                cornerRadius={20}
                height={20}
                fill={hover ? 'grey' : '#fff'}
                shadowBlur={4}
                shadowColor={'black'}
            />
            <Text
                text={`${method.id}`}
                fill={"black"}
                x={15}
                y={5}
            />
        </Group>
    )
}