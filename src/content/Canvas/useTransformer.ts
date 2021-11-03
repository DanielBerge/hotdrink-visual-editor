import React from "react";


export function useTransformer(isSelected: boolean) {
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

    return [shapeRef, trRef]
}