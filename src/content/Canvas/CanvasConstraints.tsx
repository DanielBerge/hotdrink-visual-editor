import React, {FC} from "react";
import {Arrow, Group, Layer, Rect} from "react-konva";
import {Constraint, Elem} from "../../types";
import {getPoints} from "../../utils";
import {KonvaEventObject} from "konva/lib/Node";

interface Props {
    onClick: (element: Elem | Constraint) => void;
    setOpen: (open: boolean) => void;
    constraints: any;
    elements: any;
}

export const CanvasConstraints: FC<Props> = ({onClick, setOpen, constraints, elements}) => {

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
        <Layer>
            {constraints.constraints.map((constraint: Constraint) => {
                return (
                    <Group>
                        <Rect
                            x={constraint.x}
                            y={constraint.y}
                            width={constraint.width}
                            height={constraint.height}
                            onClick={() => {
                                constraints.setCurrent(constraint);
                                elements.setCurrent(undefined);
                                onClick(constraint);
                            }}
                            fill="red"
                            onDragMove={(e) => onDragConstraintMove(e, constraint)}
                            draggable
                        />
                        {constraint.methods.map((method, index) => {
                            return <Rect
                                key={method.id}
                                x={constraint.x}
                                y={constraint.y + index * 30}
                                width={constraint.width / 2}
                                height={20}
                                fill={"green"}
                                onClick={() => {
                                    setOpen(true)
                                    constraints.setCurrent(constraint);
                                    constraints.setCurrentMethod(method);
                                    elements.setCurrent(undefined);
                                }}
                            />
                        })}
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
                    </Group>
                )
            })}
        </Layer>
    )

}