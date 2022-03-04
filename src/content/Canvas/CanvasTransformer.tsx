import {Transformer} from "react-konva";
import React, {FC} from "react";

interface Props {
    trRef: any;
}

export const CanvasTransformer: FC<Props> = ({trRef}) => {

    return (
        <Transformer
            ref={(ref) => trRef.current = ref}
            rotateEnabled={false}
            boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 10 || newBox.height < 10) {
                    return oldBox;
                }
                return newBox;
            }}
        />
    )
}