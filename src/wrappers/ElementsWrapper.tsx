import React, {FC, useContext, useState} from "react";
import {Elem} from "../types";

const ElementContext = React.createContext<any>({})
const CurrentContext = React.createContext<any>({});

export interface ElementsWrapperProps {
    elements: Elem[];
    addElement: (element: Elem) => void;
    updateElement: (oldElem: Elem, newElem: Elem) => Elem;
    getElementById: (id: string) => Elem | undefined;
    current: Elem;
    setCurrent: (element: Elem | undefined) => void;
    deleteElement: (id: string) => void;
}

const ElementsWrapper: FC = (props) => {
    const [elements, setElements] = useState<Elem[]>([])
    const [current, setCurrent] = useState(undefined);

    function addElement(element: Elem) {
        setElements([
            ...elements, element]
        )
    }

    function updateElement(oldElem: Elem, newElem: Elem): Elem {
        const index = elements.findIndex((elem: Elem) => elem.id === oldElem.id);
        if (index !== -1) {
            elements[index] = newElem;
            setElements(elements);
        } else {
            console.warn("Could not find element to update");
        }
        return newElem;
    }

    function getElementById(id: string): Elem | undefined {
        return elements.find((elem: Elem) => elem.id === id);
    }

    function deleteElement(id: string) {
        setElements(elements.filter((elem: Elem) => id !== elem.id));
    }

    return (
        <ElementContext.Provider value={{elements, addElement, updateElement, getElementById, deleteElement}}>
            <CurrentContext.Provider value={{current, setCurrent}}>
                {props.children}
            </CurrentContext.Provider>
        </ElementContext.Provider>
    )
}


function useElements(): ElementsWrapperProps {
    const {elements, addElement, updateElement, getElementById, deleteElement} = useContext(ElementContext);
    const {current, setCurrent} = useContext(CurrentContext);

    return {
        elements,
        addElement,
        updateElement,
        getElementById,
        current,
        setCurrent,
        deleteElement,
    }
}

export {ElementsWrapper, useElements};