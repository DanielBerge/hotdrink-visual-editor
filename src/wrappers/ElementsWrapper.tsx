import React, {FC, useContext, useState} from "react";
import {Elem, ElemType, InputType} from "../types";

const initialElements: Elem[] = [
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
const CurrentContext = React.createContext<any>({});

interface Elements {
    elements: Elem[];
    addElement: (element: Elem) => void;
    updateElement: (oldElem: Elem, newElem: Elem) => void;
    getElementById: (id: string) => Elem | undefined;
    current: Elem;
    setCurrent: (element: Elem) => void;
}

const ElementsWrapper: FC = (props) => {
    const [elements, setElements] = useState(initialElements)
    const [current, setCurrent] = useState(undefined);

    function addElement(element: Elem) {
        setElements([
            ...elements, element]
        )
    }

    function updateElement(oldElem: Elem, newElem: Elem) {
        const index = elements.findIndex((elem: Elem) => elem.id === oldElem.id);
        if (index !== -1) {
            elements[index] = newElem;
            setElements(elements);
        } else {
            console.warn("Could not find element to update");
        }
    }

    function getElementById(id: string): Elem | undefined {
        return elements.find((element: Elem) => {
            if (element.id === id) {
                return element;
            }
            return undefined;
        })
    }

    return (
        <ElementContext.Provider value={{elements, addElement, updateElement, getElementById}}>
            <CurrentContext.Provider value={{current, setCurrent}}>
                {props.children}
            </CurrentContext.Provider>
        </ElementContext.Provider>
    )
}


function useElements(): Elements {
    const {elements, addElement, updateElement, getElementById} = useContext(ElementContext);
    const {current, setCurrent} = useContext(CurrentContext);

    return {
        elements,
        addElement,
        updateElement,
        getElementById,
        current,
        setCurrent,
    }
}

export {ElementsWrapper, useElements};