import React, {FC} from "react";
import {Group, Rect, Text, Transformer} from "react-konva";
import {Elem} from "../../types";
import {KonvaEventObject} from "konva/lib/Node";
import {useTransformer} from "./useTransformer";

interface Props {
    element: Elem;
    onClick: (element: Elem) => void;
    onDragMove: (e: KonvaEventObject<DragEvent>, element: Elem) => void;
    onTransform: (e: KonvaEventObject<Event>, node: any) => void;
    onTransformEnd: (e: KonvaEventObject<Event>, node: any) => void;
    isSelected: boolean;
}

export const CanvasButton: FC<Props> = ({element, onClick, onDragMove, onTransform, isSelected, onTransformEnd}) => {
    const [shapeRef, trRef] = useTransformer(isSelected);

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
                    fill="black"
                    onTransform={(e) => onTransform(e, shapeRef.current)}
                    onTransformEnd={(e) => onTransformEnd(e, shapeRef.current)}
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