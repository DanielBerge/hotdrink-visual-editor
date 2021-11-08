import {Component} from "../../types";
import {FC} from "react";
import {Rect} from "react-konva";
import Konva from "konva";

interface Props {
    component: Component;
    updateComponent: (oldComponent: Component, newComponent: Component) => void;
}

export const VisualComponent: FC<Props> = ({component, updateComponent}) => {
    function onDragEnd(e: Konva.KonvaEventObject<DragEvent>) {
        updateComponent(component, {
            ...component,
            x: e.target.x(),
            y: e.target.y(),
        })
    }


    return (
        <Rect
            x={component.x}
            y={component.y}
            width={component.width}
            height={component.height}
            fill="red"
            draggable
            onDragEnd={onDragEnd}
            cornerRadius={10}
        />
    )
}