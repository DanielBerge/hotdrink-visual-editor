import React, {FC} from "react";
import {Rect, Transformer} from "react-konva";
import {Constraint, Elem} from "../../../types";
import {KonvaEventObject} from "konva/lib/Node";
import {useTransformer} from "../useTransformer";
import {ConstraintsWrapperProps} from "../../../wrappers/ConstraintsWrapper";
import {ElementsWrapperProps} from "../../../wrappers/ElementsWrapper";

interface Props {
    constraint: Constraint;
    constraints: ConstraintsWrapperProps;
    elements: ElementsWrapperProps;
    onClick: (e: Constraint) => void;
    selected: boolean;
}

export const CanvasConstraintRect: FC<Props> = ({constraints, constraint, elements, onClick, selected}) => {
    const [shapeRef, trRef] = useTransformer(selected);

    function onDragConstraintMove(e: KonvaEventObject<DragEvent>, constraint: Constraint) {
        constraints.setCurrent(
            constraints.updateConstraint(constraint, {
                ...constraint,
                x: e.target.x(),
                y: e.target.y(),
            })
        )
    }

    return (
        <>
            <Rect
                // @ts-ignore
                ref={(ref) => shapeRef.current = ref}
                x={constraint.x}
                y={constraint.y}
                width={constraint.width}
                height={constraint.height}
                onClick={() => {
                    constraints.setCurrent(constraint);
                    constraints.setCurrentMethod(undefined);
                    elements.setCurrent(undefined);
                    onClick(constraint);
                }}
                cornerRadius={50}
                fill={"red"}
                stroke={"black"}
                strokeWidth={2}
                onDragMove={(e) => onDragConstraintMove(e, constraint)}
                draggable
            />
            {selected && <Transformer
                // @ts-ignore
                ref={(ref) => trRef.current = ref}
                rotateEnabled={false}
                resizeEnabled={false}
                borderStrokeWidth={2}
            />}
        </>
    )
}