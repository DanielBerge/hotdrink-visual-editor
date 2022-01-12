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
}

export const CanvasMethodCircle: FC<Props> = ({setOpen, constraints, constraint, elements, method, index}) => {
    const [hover, setHover] = React.useState(false);

    return (
        <Group
            x={constraint.x + constraint.width / 4}
            y={constraint.y + index * 30 + 10}
            onClick={() => {
                setOpen(true)
                constraints.setCurrent(constraint);
                constraints.setCurrentMethod(method);
                elements.setCurrent(undefined);
            }}
            onMouseOver={() => {
                constraints.setCurrentMethod(method);
                constraints.setCurrent(constraint);
                elements.setCurrent(undefined);
                setHover(true);
            }}
            onMouseLeave={() => {
                constraints.setCurrentMethod(undefined);
                setHover(false);
            }}
        >
            <Rect
                key={method.id}
                width={constraint.width / 2}
                cornerRadius={20}
                height={20}
                fill={hover ? 'grey' : '#fff'}
                strokeWidth={2}
                stroke={"black"}
            />
            <Text
                text={`M ${method.id}`}
                fill={"black"}
                x={15}
                y={5}
            />
        </Group>
    )
}