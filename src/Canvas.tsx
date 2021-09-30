import React, {FC} from 'react';
import {Layer, Rect, Stage} from 'react-konva';
import {Elem, ElemType} from "./App";

interface Props {
    elements: Elem[];
}

export const Canvas: FC<Props> = ({elements}) => {
    return (
        <div className="w-screen h-screen">
            <Stage width={500} height={500} className="bg-gray-100">
                <Layer>
                    {elements.map((element: Elem, key) => {
                        switch (element.type) {
                            case ElemType.Input:
                                return (
                                    <Rect
                                        key={key}
                                        width={element.width}
                                        height={element.height}
                                        x={element.x}
                                        y={element.y}
                                        fill="grey"
                                    />
                                )
                            case ElemType.Button:
                                return (
                                    <Rect
                                        key={key}
                                        width={element.width}
                                        height={element.height}
                                        x={element.x}
                                        y={element.y}
                                        fill="green"
                                    />
                                )
                            default:
                                return null;
                        }
                    })}
                </Layer>
            </Stage>
        </div>
    );
};