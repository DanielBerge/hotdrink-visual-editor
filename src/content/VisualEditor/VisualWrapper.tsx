import React, {FC, useContext, useState} from "react";
import {VComponent, Connection} from "../../types";

const ComponentContext = React.createContext<any>({})
const ConnectionContext = React.createContext<any>({})

const initialComponents: VComponent[] = [
    {
        id: "1",
        x: 10,
        y: 10,
        width: 200,
        height: 200,
        outputs: [
            {
                id: "1",
                label: "a",
                variable: "a",
            },
        ],
    },
    {
        id: "2",
        x: 200,
        y: 200,
        width: 200,
        height: 200,
        inputs: [
            {
                id: "2",
                label: "a",
                variable: "a",
            },
            {
                id: "3",
                label: "a",
                variable: "a",
            },
            {
                id: "4",
                label: "a",
                variable: "a",
            },
        ],
        outputs: [
            {
                id: "5",
                label: "a",
                variable: "b",
            },
        ],
    },
]

export interface Visual {
    components: VComponent[],
    setComponents: (components: VComponent[]) => void,
    updateComponent: (oldComponent: VComponent, newComponent: VComponent) => void,
    connections: Connection[],
    setConnections: (connections: Connection[]) => void,
    getComponentById: (id: string) => VComponent,
}

export const VisualWrapper: FC = (props) => {
    const [components, setComponents] = useState(initialComponents);
    const [connections, setConnections] = useState<string[]>([]);

    function updateComponent(oldComponent: VComponent, newComponent: VComponent) {
        const index = components.findIndex(component => component.id === oldComponent.id);
        const newComponents = [...components];
        newComponents[index] = newComponent;
        setComponents(newComponents);
    }

    function getComponentById(id: string): VComponent | undefined {
        return components.find(component => component.id === id);
    }

    return (
        <ComponentContext.Provider value={{components, setComponents, updateComponent, getComponentById}}>
            <ConnectionContext.Provider value={{connections, setConnections}}>
                {props.children}
            </ConnectionContext.Provider>
        </ComponentContext.Provider>
    )
}

export function useVisual(): Visual {
    const {components, setComponents, updateComponent, getComponentById} = useContext(ComponentContext);
    const {connections, setConnections} = useContext(ConnectionContext);

    return {
        components,
        setComponents,
        updateComponent,
        connections,
        setConnections,
        getComponentById,
    }
}