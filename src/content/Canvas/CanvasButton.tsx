import React, {FC} from "react";
import {Group, Rect, Text, Transformer} from "react-konva";
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

export const CanvasButton: FC<Props> =
    ({
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
                <Group
                    // @ts-ignore
                    ref={(ref) => shapeRef.current = ref}
                    x={element.x}
                    y={element.y}
                    draggable
                    onClick={() => onClick(element)}
                    onDragMove={(e) => onDragMove(e, element)}
                >
                    <Rect
                        width={element.width}
                        height={element.height}
                        fill={chooseStroke()}
                        onTransform={(e) => onTransform(e, shapeRef.current)}
                        onTransformEnd={(e) => onTransformEnd(e, shapeRef.current, element)}
                    />
                    <Text
                        text={element.value}
                        fill="white"
                        align="center"
                        width={element.width}
                        padding={15}
                        fontSize={16}
                    />
                </Group>
                {isSelected &&
                    <Transformer
                        // @ts-ignore
                        ref={(ref) => trRef.current = ref}
                        rotateEnabled={false}
                    />
                }
            </>
        )
    }