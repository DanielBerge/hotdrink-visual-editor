import React, {FC, useContext, useState} from "react";
import {Component} from "../../types";

const ComponentContext = React.createContext<any>({})

const initialComponents: Component[] = [
    {
        id: "1",
        x: 10,
        y: 10,
        width: 100,
        height: 100,
    },
    {
        id: "2",
        x: 200,
        y: 200,
        width: 100,
        height: 100,
    },
]

export interface Components {
    components: Component[],
    setComponents: (components: Component[]) => void,
    updateComponent: (oldComponent: Component, newComponent: Component) => void,
}

export const VisualWrapper: FC = (props) => {
    const [components, setComponents] = useState(initialComponents);

    function updateComponent(oldComponent: Component, newComponent: Component) {
        const index = components.findIndex(component => component.id === oldComponent.id);
        const newComponents = [...components];
        newComponents[index] = newComponent;
        setComponents(newComponents);
    }

    return (
        <ComponentContext.Provider value={{components, setComponents, updateComponent}}>
            {props.children}
        </ComponentContext.Provider>
    )
}

export function useVisual(): Components {
    const {components, setComponents, updateComponent} = useContext(ComponentContext);

    return {
        components,
        setComponents,
        updateComponent,
    }
}