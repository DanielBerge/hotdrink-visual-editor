import React, {useState} from 'react';
import {Canvas} from './Canvas';
import {Column} from "./sides/Column";
import {Components} from "./sides/Components";
import {Properties} from "./sides/Properties";
import {useRete} from "./rete/useRete";

export enum ElemType {
    Input = "input",
    Button = "button",
}

export interface Elem {
    height: number;
    width: number;
    x: number;
    y: number;
    type: ElemType;
    value: string;
    id: string;
}

const initialElements: Elem[] = [
    {
        height: 50,
        width: 200,
        x: 100,
        y: 100,
        type: ElemType.Input,
        value: "value",
        id: "id",
    },
    {
        height: 50,
        width: 150,
        x: 200,
        y: 300,
        type: ElemType.Button,
        value: "value2",
        id: "id2",
    }
]

export const ElementContext = React.createContext<any>({})
export const CurrentContext = React.createContext<any>({});

function App() {
    const json = JSON.stringify(initialElements);
    const fromJson: Elem[] = JSON.parse(json);
    const [elements, setElements] = useState(fromJson)
    const [current, setCurrent] = useState(undefined);

    function addElement(element: Elem) {
        setElements([
            ...elements, element]
        )
    }

    function updateElement(oldElem: Elem, newElem: Elem) {
        const index = elements.findIndex((elem) => elem === oldElem);
        if (index !== -1) {
            elements[index] = newElem;
            setElements(elements);
        }
    }

    return (
        <ElementContext.Provider value={{elements, addElement, updateElement}}>
            <CurrentContext.Provider value={{current, setCurrent}}>
                <div className="flex space-x-3 h-screen">
                    <Column>
                        <Components/>
                    </Column>
                    <div className="flex-1">
                        <Canvas/>
                    </div>
                    <Column>
                        <Properties/>
                    </Column>
                </div>
            </CurrentContext.Provider>
        </ElementContext.Provider>
    );
}

export default App;
