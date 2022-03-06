import {CanvasElementProps} from "./CanvasElementProps";
import React, {FC} from "react";
import {useTransformer} from "./useTransformer";
import {Group, Rect} from "react-konva";
import {CanvasTransformer} from "./CanvasTransformer";


export const CanvasCheckbox: FC<CanvasElementProps> = ({
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
};