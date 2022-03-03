import React, {FC} from "react";
import {freshId} from "../App";
import {Binding, ElemType, InputType} from "../types";
import {useElements} from "../wrappers/ElementsWrapper";
import {ComponentProperties} from "./Properties/Components/ComponentProperties";
import {useConstraints} from "../wrappers/ConstraintsWrapper";

export const sideOffset = 300;

export const Components: FC = () => {
    const elements = useElements();
    const constraints = useConstraints();

    return (
        <>
            <h1 className="font-bold text-lg">
                Components
            </h1>
            <div
                draggable
                className="w-24 bg-white border border-black p-3 m-1"
                onDragEnd={(event => {
                    elements.addElement({
                        id: `id${freshId()}`,
                        height: 50,
                        width: 200,
                        x: event.clientX - sideOffset,
                        y: event.clientY,
                        type: ElemType.Input,
                        binding: Binding.Value,
                        subType: InputType.Text,
                        value: "value",
                    })
                })}
            >Input
            </div>
            <div
                draggable
                className="w-24 bg-black text-white p-3 m-1"
                onDragEnd={(event => {
                    elements.addElement({
                        id: `id${freshId()}`,
                        height: 50,
                        width: 200,
                        x: event.clientX - sideOffset,
                        y: event.clientY,
                        type: ElemType.Button,
                        binding: Binding.Disabled,
                        value: "value",
                    })
                })}
            >Button
            </div>
            <div
                draggable
                className="w-24 text-black p-3 m-1 border border-black"
                onDragEnd={(event => {
                    elements.addElement({
                        id: `id${freshId()}`,
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

            <ComponentProperties/>
            {elements.current && (
                <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 m-1"
                    onClick={() => {
                        elements.deleteElement(elements.current.id);
                        constraints.deleteConstraintsConnected(elements.current.id);
                        elements.setCurrent(undefined);
                    }}
                >Delete component
                </button>
            )}
        </>
    )
}