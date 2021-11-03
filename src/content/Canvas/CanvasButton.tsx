import React, {FC} from "react";
import {Group, Rect, Text} from "react-konva";
import {Elem} from "../../types";
import {KonvaEventObject} from "konva/lib/Node";

interface Props {
    element: Elem;
    onClick: (element: Elem) => void;
    onDragMove: (e: KonvaEventObject<DragEvent>, element: Elem) => void;
}

export const CanvasButton: FC<Props> = ({element, onClick, onDragMove}) => {
    return (
        <Group
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
    )
}