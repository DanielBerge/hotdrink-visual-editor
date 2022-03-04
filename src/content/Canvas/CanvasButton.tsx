import React, {FC} from "react";
import {Group, Rect, Text} from "react-konva";
import {useTransformer} from "./useTransformer";
import {CanvasTransformer} from "./CanvasTransformer";
import {CanvasElementProps} from "./CanvasElementProps";


export const CanvasButton: FC<CanvasElementProps> =
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
                <Group
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
                        fill={chooseStrokeColor(element)}
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
                    <CanvasTransformer trRef={trRef}/>
                }
            </>
        )
    }