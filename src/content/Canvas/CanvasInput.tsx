import React, {FC} from "react";
import {Rect, Transformer} from "react-konva";
import {Elem} from "../../types";
import {KonvaEventObject} from "konva/lib/Node";

interface Props {
    element: Elem;
    onClick: (element: Elem) => void;
    onDragMove: (e: KonvaEventObject<DragEvent>, element: Elem) => void;
    isSelected: boolean;
    onTransform: (e: KonvaEventObject<Event>, scaleX: number, scaleY: number) => void;
}

export const CanvasInput: FC<Props> = ({element, onClick, onDragMove, isSelected, onTransform}) => {
    const shapeRef = React.useRef(null);
    const trRef = React.useRef(null);

    React.useEffect(() => {
        if (isSelected) {
            // @ts-ignore
            trRef?.current?.nodes([shapeRef.current]);
            // @ts-ignore
            trRef?.current?.getLayer().batchDraw();
        }
    }, [isSelected]);

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
                onTransform={(e) => {
                    const node = shapeRef.current;
                    // @ts-ignore
                    const scaleX = node?.scaleX();
                    // @ts-ignore
                    const scaleY = node?.scaleY();
                    // @ts-ignore
                    node?.scaleX(1);
                    // @ts-ignore
                    node?.scaleY(1);
                    onTransform(e, scaleX, scaleY);
                }}
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