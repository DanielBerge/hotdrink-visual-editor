import React, {FC, useContext, useState} from "react";
import {Element, ElemType, InputType} from "../types";

const initialElements: Element[] = [
    {
        height: 50,
        width: 200,
        x: 100,
        y: 100,
        type: ElemType.Input,
        subType: InputType.Number,
        value: "",
        id: "initial",
    },
    {
        height: 50,
        width: 150,
        x: 200,
        y: 300,
        type: ElemType.Input,
        value: "value2",
        id: "initial2",
    }
]

const ElementContext = React.createContext<any>({})

interface Elements {
    elements: Element[];
    addElement: (element: Element) => void;
    updateElement: (oldElem: Element, newElem: Element) => void;
    getElementById: (id: string) => Element | undefined;
}

export const ElementsWrapper: FC = (props) => {
    const [elements, setElements] = useState(initialElements)

    function addElement(element: Element) {
        setElements([
            ...elements, element]
        )
    }

    function updateElement(oldElem: Element, newElem: Element) {
        const index = elements.findIndex((elem: Element) => elem.id === oldElem.id);
        if (index !== -1) {
            elements[index] = newElem;
            setElements(elements);
        } else {
            console.warn("Could not find element to update");
        }
    }

    function getElementById(id: string): Element | undefined {
        return elements.find((element: Element) => {
            if (element.id === id) {
                return element;
            }
            return undefined;
        })
    }

    return (
        <ElementContext.Provider value={{elements, addElement, updateElement, getElementById}}>
            {props.children}
        </ElementContext.Provider>
    )
}


export function useElements(): Elements {
    const {elements, addElement, updateElement, getElementById} = useContext(ElementContext);

    return {
        elements,
        addElement,
        updateElement,
        getElementById
    }
}