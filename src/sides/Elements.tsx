import React, {FC} from "react";
import {freshId} from "../App";
import {Binding, ElemType, InputType} from "../types";
import {useElements} from "../wrappers/ElementsWrapper";

export const sideOffset = 450;

export const Elements: FC = () => {
    const elements = useElements();

    function generateFreshId(type: ElemType): string {
        switch (type) {
            case ElemType.Button:
                return "button" + freshId();
            case ElemType.Input:
                return "input" + freshId();
            case ElemType.Text:
                return "text" + freshId();
            default:
                return "id" + freshId();
        }
    }

    return (
        <>
            <h1 className="font-bold text-lg">
                Elements
            </h1>
            <div
                draggable
                className="w-24 bg-white border border-black p-3 m-1"
                onDragEnd={(event => {
                    elements.addElement({
                        id: generateFreshId(ElemType.Input),
                        height: 50,
                        width: 200,
                        x: event.clientX - sideOffset,
                        y: event.clientY,
                        type: ElemType.Input,
                        binding: Binding.Value,
                        subType: InputType.Text,
                        value: "",
                    })
                })}
            >Input
            </div>
            <div
                draggable
                className="w-24 bg-black text-white p-3 m-1"
                onDragEnd={(event => {
                    elements.addElement({
                        id: generateFreshId(ElemType.Button),
                        height: 50,
                        width: 200,
                        x: event.clientX - sideOffset,
                        y: event.clientY,
                        type: ElemType.Button,
                        binding: Binding.Disabled,
                        value: "Name",
                    })
                })}
            >Button
            </div>
            <div
                draggable
                className="w-24 text-black p-3 m-1 border border-black"
                onDragEnd={(event => {
                    elements.addElement({
                        id: generateFreshId(ElemType.Text),
                        height: 50,
                        width: 200,
                        x: event.clientX - sideOffset,
                        y: event.clientY,
                        type: ElemType.Text,
                        binding: Binding.InnerText,
                        value: "Textvalue",
                    })
                })}
            >Text
            </div>
        </>
    )
}