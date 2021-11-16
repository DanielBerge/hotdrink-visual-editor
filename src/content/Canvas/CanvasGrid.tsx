import {Layer, Line} from "react-konva";
import React, {FC} from "react";
import {HEIGHT, SNAP_SPACE, WIDTH} from "./canvasUtils";


export const CanvasGrid: FC = () => {
    return (
        <Layer>
            {
                Array.from(Array(HEIGHT).keys()).filter((i) => i % SNAP_SPACE === 0).map((y) => {
                    return (
                        <Line
                            key={y}
                            points={[0, y, WIDTH, y]}
                            width={WIDTH}
                            stroke="gray"
                            strokeWidth={0.5}
                        />
                    )
                })
            }
            {
                Array.from(Array(WIDTH).keys()).filter((i) => i % SNAP_SPACE === 0).map((x) => {
                    return (
                        <Line
                            key={x}
                            points={[x, 0, x, HEIGHT]}
                            width={WIDTH}
                            stroke="gray"
                            strokeWidth={0.5}
                        />
                    )
                })
            }
        </Layer>
    )
}