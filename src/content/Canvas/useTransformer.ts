import React from "react";


export function useTransformer(isSelected: boolean): [any, any] {
    const shapeRef = React.useRef<any>(null);
    const trRef = React.useRef<any>(null);

    React.useEffect(() => {
        if (isSelected) {
            trRef?.current?.nodes([shapeRef.current]);
            trRef?.current?.getLayer().batchDraw();
        }
    }, [isSelected]);

    return [shapeRef, trRef]
}