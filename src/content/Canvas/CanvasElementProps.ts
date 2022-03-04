import {Elem} from "../../types";
import {KonvaEventObject} from "konva/lib/Node";

export interface CanvasElementProps {
    element: Elem;
    onClick: (element: Elem) => void;
    onDragMove: (e: KonvaEventObject<DragEvent>, element: Elem) => void;
    isSelected: boolean;
    onTransform: (e: KonvaEventObject<Event>, node: any) => void;
    onTransformEnd: (e: KonvaEventObject<Event>, node: any, element: Elem) => void;
    chooseStrokeColor: (element: Elem) => string;
}
