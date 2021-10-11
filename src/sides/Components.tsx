import React, {FC, useContext} from "react";
import {ElementContext} from "../App";
import {ElemType} from "../types";


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
                        value: "value",
                        id: "id1",
                    })
                })}
            >Input
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
                        id: "id2",
                    })
                })}
            >Button
            </div>
        </>
    )
}