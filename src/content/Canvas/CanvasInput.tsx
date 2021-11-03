import React, {FC} from "react";
import {Rect, Transformer} from "react-konva";
import {Elem} from "../../types";
import {KonvaEventObject} from "konva/lib/Node";
import {useTransformer} from "./useTransformer";

interface Props {
    element: Elem;
    onClick: (element: Elem) => void;
    onDragMove: (e: KonvaEventObject<DragEvent>, element: Elem) => void;
    isSelected: boolean;
    onTransform: (e: KonvaEventObject<Event>, node: any) => void;
}

export const CanvasInput: FC<Props> = ({element, onClick, onDragMove, isSelected, onTransform}) => {
    const [shapeRef, trRef] = useTransformer(isSelected);

    return (
        <>
            <Rect
                // @ts-ignore
                ref={(ref) => shapeRef.current = ref}
                width={element.width}
                height={element.height}
                draggable
                x={element.x}
                y={element.y}
                fill="white"
                stroke="black"
                onClick={() => onClick(element)}
                onDragMove={(e) => onDragMove(e, element)}
                onTransform={(e) => onTransform(e, shapeRef.current)}
            />
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