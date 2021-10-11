import React, {useState} from 'react';
import {Canvas} from './Canvas';
import {Column} from "./sides/Column";
import {Components} from "./sides/Components";
import {Properties} from "./sides/Properties";
import {Constraints} from "./sides/Constraints";
import {Constraint, Elem, ElemType} from "./types";


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

const initialConstraints: Constraint[] = [
    {
        fromId: "id",
        toId: "id2",
        code: ""
    }
]

export const ElementContext = React.createContext<any>({})
export const ConstraintContext = React.createContext<any>({})
export const CurrentContext = React.createContext<any>({});
export const NewConstraintContext = React.createContext<any>(false);

function App() {
    const json = JSON.stringify(initialElements);
    const fromJson: Elem[] = JSON.parse(json);
    const [elements, setElements] = useState(fromJson)
    const [current, setCurrent] = useState(undefined);
    const [constraints, setConstraints] = useState(initialConstraints);
    const [newConstraint, setNewConstraint] = useState(false);

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

    function getElementById(id: string): Elem | undefined {
        return elements.find((element) => {
            if (element.id === id) {
                return element;
            }
            return undefined;
        })
    }

    return (
        <ElementContext.Provider value={{elements, addElement, updateElement, getElementById}}>
            <ConstraintContext.Provider value={{constraints, setConstraints}}>
                <CurrentContext.Provider value={{current, setCurrent}}>
                    <NewConstraintContext.Provider value={{newConstraint, setNewConstraint}}>
                        <div className="flex space-x-3 h-screen">
                            <Column>
                                <Components/>
                                <Constraints/>
                            </Column>
                            <div className="flex-1">
                                <Canvas/>
                            </div>
                            <Column>
                                <Properties/>
                            </Column>
                        </div>
                    </NewConstraintContext.Provider>
                </CurrentContext.Provider>
            </ConstraintContext.Provider>
        </ElementContext.Provider>
    );
}

export default App;
