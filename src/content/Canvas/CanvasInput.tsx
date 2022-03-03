import React, {FC} from "react";
import {Circle, Group, Rect, Transformer} from "react-konva";
import {Constraint, Elem} from "../../types";
import {KonvaEventObject} from "konva/lib/Node";
import {useTransformer} from "./useTransformer";

interface Props {
    element: Elem;
    onClick: (element: Elem) => void;
    onDragMove: (e: KonvaEventObject<DragEvent>, element: Elem) => void;
    isSelected: boolean;
    onTransform: (e: KonvaEventObject<Event>, node: any) => void;
    onTransformEnd: (e: KonvaEventObject<Event>, node: any, element: Elem) => void;
    newConstraint: boolean;
    newMethod: boolean;
    currentElements: string[];
    currentConstraint: Constraint | undefined;
}

export const CanvasInput: FC<Props> = ({
                                           element,
                                           onClick,
                                           onDragMove,
                                           isSelected,
                                           onTransform,
                                           onTransformEnd,
                                           newConstraint,
                                           newMethod,
                                           currentElements,
                                           currentConstraint,
                                       }) => {
    const [shapeRef, trRef] = useTransformer(isSelected);

    function chooseStroke() {
        if (currentElements.includes(element.id)) {
            return 'blue';
        } else if (newConstraint || (newMethod && currentConstraint?.fromIds.includes(element.id))) {
            return 'green';
        } else {
            return 'black';
        }
    }

    return (
        <>
            <Group>
                <Rect
                    // @ts-ignore
                    ref={(ref) => shapeRef.current = ref}
                    width={element.width}
                    height={element.height}
                    draggable
                    x={element.x}
                    y={element.y}
                    fill="white"
                    stroke={chooseStroke()}
                    onClick={() => onClick(element)}
                    onDragMove={(e) => onDragMove(e, element)}
                    onTransform={(e) => onTransform(e, shapeRef.current)}
                    onTransformEnd={(e) => onTransformEnd(e, shapeRef.current, element)}
                />
            </Group>
            {isSelected &&
                <Transformer
                    // @ts-ignore
                    ref={(ref) => trRef.current = ref}
                    rotateEnabled={false}
                    boundBoxFunc={(oldBox, newBox) => {
                        if (newBox.width < 10 || newBox.height < 10) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            }
        </>
    )
}