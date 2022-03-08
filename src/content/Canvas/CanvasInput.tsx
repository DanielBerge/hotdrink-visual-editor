import React, {FC} from "react";
import {Group, Rect} from "react-konva";
import {useTransformer} from "./useTransformer";
import {CanvasTransformer} from "./CanvasTransformer";
import {CanvasElementProps} from "./CanvasElementProps";


export const CanvasInput: FC<CanvasElementProps> =
    ({
         element,
         onClick,
         onDragMove,
         isSelected,
         onTransform,
         onTransformEnd,
         chooseStrokeColor,
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
                        stroke={chooseStrokeColor(element)}
                        strokeWidth={chooseStrokeColor(element) === "blue" ? 3 : 1}
                        cornerRadius={10}
                        onClick={() => onClick(element)}
                        onDragMove={(e) => onDragMove(e, element)}
                        onTransform={(e) => onTransform(e, shapeRef.current)}
                        onTransformEnd={(e) => onTransformEnd(e, shapeRef.current, element)}
                    />
                </Group>
                {isSelected &&
                    <CanvasTransformer trRef={trRef}/>
                }
            </>
        )
    }