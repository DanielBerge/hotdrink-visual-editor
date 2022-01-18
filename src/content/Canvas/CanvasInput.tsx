import React, {FC} from "react";
import {Circle, Group, Rect, Transformer} from "react-konva";
import {Elem} from "../../types";
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
}

export const CanvasInput: FC<Props> = ({
                                           element,
                                           onClick,
                                           onDragMove,
                                           isSelected,
                                           onTransform,
                                           onTransformEnd,
                                           newConstraint
                                       }) => {
    const [shapeRef, trRef] = useTransformer(isSelected);

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
                    stroke={newConstraint ? 'green' : 'black'}
                    onClick={() => onClick(element)}
                    onDragMove={(e) => onDragMove(e, element)}
                    onTransform={(e) => onTransform(e, shapeRef.current)}
                    onTransformEnd={(e) => onTransformEnd(e, shapeRef.current, element)}
                />
                {isSelected &&
                    <Circle
                        visible={false}
                        width={40}
                        height={40}
                        x={element.x + element.width / 2}
                        y={element.y + element.height / 2}
                        fill="red"
                        onMouseDown={() => {
                            console.log("Now")
                        }}
                        onDragMove={() => {
                            console.log("??")
                        }}
                    />
                }
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