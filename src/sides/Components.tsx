import React, {FC, useContext} from "react";
import {ElementContext, freshId} from "../App";
import {ElemType, InputType} from "../types";


export const Components: FC = (props) => {
    const {elements, addElement} = useContext(ElementContext);

    return (
        <>
            <h1>
                Components
            </h1>
            <div
                draggable
                className="w-24 bg-white border border-black p-3 m-1"
                onDragEnd={(event => {
                    addElement({
                        height: 50,
                        width: 200,
                        x: event.clientX,
                        y: event.clientY,
                        type: ElemType.Input,
                        subType: InputType.Number,
                        value: "value",
                        id: `id${freshId()}`,
                    })
                })}
            >Input number
            </div>
            <div
                draggable
                className="w-24 bg-white border border-black p-3 m-1"
                onDragEnd={(event => {
                    addElement({
                        height: 50,
                        width: 200,
                        x: event.clientX,
                        y: event.clientY,
                        type: ElemType.Input,
                        subType: InputType.Text,
                        value: "value",
                        id: `id${freshId()}`,
                    })
                })}
            >Input text
            </div>
            <div
                draggable
                className="w-24 bg-black text-white p-3 m-1"
                onDragEnd={(event => {
                    addElement({
                        height: 50,
                        width: 200,
                        x: event.clientX,
                        y: event.clientY,
                        type: ElemType.Button,
                        value: "value",
                        id: `id${freshId()}`,
                    })
                })}
            >Button
            </div>
            <div
                draggable
                className="w-24 text-black p-3 m-1 border border-black"
                onDragEnd={(event => {
                    addElement({
                        height: 50,
                        width: 200,
                        x: event.clientX,
                        y: event.clientY,
                        type: ElemType.Text,
                        value: "Textvalue",
                        id: `id${freshId()}`,
                    })
                })}
            >Text
            </div>
        </>
    )
}