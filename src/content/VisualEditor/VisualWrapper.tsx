import React, {FC, useContext, useState} from "react";
import {Connection, LibraryComponent, Socket, VComponent} from "../../types";

const ComponentContext = React.createContext<any>({})
const ConnectionContext = React.createContext<any>({})
const LibraryContext = React.createContext<any>({})

const initialComponents: VComponent[] = [
    {
        id: "1",
        label: "Input",
        x: 100,
        y: 100,
        width: 200,
        height: 200,
        outputs: [
            {
                id: "1",
                label: "a",
                variable: "initial",
            },
            {
                id: "1",
                label: "a",
                variable: "initial",
            },
        ],
        code: (inputConnections: Connection[], outputSockets: Socket[]) => {
            return "";
        }
    },
    {
        id: "2",
        label: "Output",
        x: 600,
        y: 100,
        width: 200,
        height: 200,
        inputs: [
            {
                id: "2",
                label: "a",
                variable: "a",
            },
        ],
        code: (inputConnections: Connection[], outputSockets: Socket[]) => {
            if (inputConnections.length === 1) {
                return `return ${inputConnections[0].fromSocket?.variable ?? ""};\n`;
            }
            return "";
        }
    },
    {
        id: "3",
        label: "Add 100",
        x: 300,
        y: 100,
        width: 200,
        height: 200,
        inputs: [
            {
                id: "3",
                label: "a",
                variable: "a",
            },
        ],
        outputs: [
            {
                id: "3",
                label: "a",
                variable: "addhundred",
            },
        ],
        code: (inputConnections: Connection[], outputSockets: Socket[]) => {
            if (inputConnections.length === 1 && outputSockets.length === 1) {
                return `const ${outputSockets[0].variable} = ${inputConnections[0].fromSocket?.variable ?? ""} + 100;\n`;
            }
            return "";
        }
    }
]

const initialLibraryComponents: LibraryComponent[] = [
    {
        id: "1",
        label: "Input",
        outputs: [
            {
                id: "1",
                label: "a",
                variable: "initial",
            },
        ],
        code: (inputConnections: Connection[], outputSockets: Socket[]) => {
            return "";
        }
    },
    {
        id: "2",
        label: "Output",
        inputs: [
            {
                id: "2",
                label: "a",
                variable: "a",
            },
        ],
        code: (inputConnections: Connection[], outputSockets: Socket[]) => {
            if (inputConnections.length === 1) {
                return `return ${inputConnections[0].fromSocket?.variable ?? ""};\n`;
            }
            return "";
        }
    },
    {
        id: "3",
        label: "Add 100",
        inputs: [
            {
                id: "3",
                label: "a",
                variable: "a",
            },
        ],
        outputs: [
            {
                id: "3",
                label: "a",
                variable: "addhundred",
            },
        ],
        code: (inputConnections: Connection[], outputSockets: Socket[]) => {
            if (inputConnections.length === 1 && outputSockets.length === 1) {
                return `const ${outputSockets[0].variable} = ${inputConnections[0].fromSocket?.variable ?? ""} + 100;\n`;
            }
            return "";
        }
    }
]

export interface Visual {
    libraryComponents: LibraryComponent[];
    setLibraryComponents: (libraryComponents: LibraryComponent[]) => void;
    components: VComponent[],
    setComponents: (components: VComponent[]) => void,
    updateComponent: (oldComponent: VComponent, newComponent: VComponent) => void,
    connections: Connection[],
    setConnections: (connections: Connection[]) => void,
    getComponentById: (id: string) => VComponent,
}

export const VisualWrapper: FC = (props) => {
    const [libraryComponents, setLibraryComponents] = useState<LibraryComponent[]>(initialLibraryComponents);
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
                <LibraryContext.Provider value={{libraryComponents, setLibraryComponents}}>
                    {props.children}
                </LibraryContext.Provider>
            </ConnectionContext.Provider>
        </ComponentContext.Provider>
    )
}

export function useVisual(): Visual {
    const {libraryComponents, setLibraryComponents} = useContext(LibraryContext);
    const {components, setComponents, updateComponent, getComponentById} = useContext(ComponentContext);
    const {connections, setConnections} = useContext(ConnectionContext);

    return {
        libraryComponents,
        setLibraryComponents,
        components,
        setComponents,
        updateComponent,
        connections,
        setConnections,
        getComponentById,
    }
}