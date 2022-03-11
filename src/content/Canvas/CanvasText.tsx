import React, {FC} from "react";
import {Text} from "react-konva";
import {Elem} from "../../types";
import {KonvaEventObject} from "konva/lib/Node";

interface Props {
    element: Elem;
    onClick: (element: Elem) => void;
    onDragMove: (e: KonvaEventObject<DragEvent>, element: Elem) => void;
    chooseStrokeColor: (element: Elem) => string;
}

export const CanvasText: FC<Props> =
    ({element, onClick, onDragMove, chooseStrokeColor}) => {
        return (
            <Text
                text={element.value}
                fill={chooseStrokeColor(element)}
                align="left"
                width={element.value.length * 12 + 30}
                height={element.height}
                padding={15}
                fontSize={16}
                draggable
                x={element.x}
                y={element.y}
                onClick={() => onClick(element)}
                onDragMove={(e) => onDragMove(e, element)}
            />
        )
    }