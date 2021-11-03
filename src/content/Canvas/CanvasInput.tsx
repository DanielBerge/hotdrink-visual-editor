import React, {FC} from "react";
import {Rect} from "react-konva";
import {Elem} from "../../types";
import {KonvaEventObject} from "konva/lib/Node";

interface Props {
    element: Elem;
    onClick: (element: Elem) => void;
    onDragMove: (e: KonvaEventObject<DragEvent>, element: Elem) => void;
}

export const CanvasInput: FC<Props> = ({element, onClick, onDragMove}) => {

    return (
        <Rect
            width={element.width}
            height={element.height}
            draggable
            x={element.x}
            y={element.y}
            fill="white"
            stroke="black"
            onClick={() => onClick(element)}
            onDragMove={(e) => onDragMove(e, element)}
        />
    )
}