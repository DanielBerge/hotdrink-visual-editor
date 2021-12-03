import React, {FC, useContext, useState} from "react";
import {Connection, LibraryComponent, VComponent} from "../../types";

const ComponentContext = React.createContext<any>({})
const ConnectionContext = React.createContext<any>({})
const LibraryContext = React.createContext<any>({})
const ObjectContext = React.createContext<any>({})

const libInput = [{
    label: "Add", inputs: [], output: "Add", codeLine: "a + textBox"
}, {
    label: "Division",
    inputs: [{variable: "divisor"}, {variable: "dividend"},],
    output: "Division",
    codeLine: "dividend / divisor"
}, {
    label: "Concat", inputs: [{variable: "str"}], output: "Concat", codeLine: "textBox.concat(str);"
}]

function dslToLib(library: any): LibraryComponent[] {
    let freshIndex = 0;
    return library.map((lib: any) => {
        let codeStr: string = lib.codeLine;
        lib.inputs = lib.inputs.map((input: any, index: number) => {
            return {
                id: index,
                variable: input.variable,
            }
        })
        lib.outputs = [{
            id: 0,
            variable: lib.output,
        }]
        lib.id = "lib-" + freshIndex++;
        lib.code = (inputConnections: Connection[], component: VComponent) => {
            lib.inputs.forEach((input: any, index: number) => {
                codeStr = codeStr.replace(input.variable, inputConnections[index]?.fromSocket?.variable ?? input.variable);
            })
            if (inputConnections.length > 1 && component.outputs?.length === 1) {
                return `const ${component.outputs[0].variable} = ${codeStr};\n`
            }
            return "";
        }
        return lib;
    });
}

const initialLibraryComponents: LibraryComponent[] = [
    {
        id: "3",
        label: "Add 100",
        inputs: [
            {
                id: "1",
                variable: "NumberToAdd",
            },
        ],
        outputs: [
            {
                id: "1",
                variable: "addhundred",
            },
        ],
        code: (inputConnections: Connection[], component) => {
            if (inputConnections.length === 1 && component.outputs?.length === 1) {
                return `const ${component.outputs[0].variable} = ${inputConnections[0].fromSocket?.variable ?? ""} + 100;\n`;
            }
            return "";
        }
    },
    {
        id: "4",
        label: "Multiply",
        inputField: "Multiply by",
        inputs: [
            {
                id: "4",
                variable: "a",
            },
        ],
        outputs: [
            {
                id: "4",
                variable: "multiply",
            },
        ],
        code: (inputConnections: Connection[], component) => {
            if (inputConnections.length === 1 && component.outputs?.length === 1) {
                return `const ${component.outputs[0].variable} = ${inputConnections[0].fromSocket?.variable ?? ""} * ${component.value};\n`;
            }
            if (inputConnections.length === 2 && component.outputs?.length === 1) {
                return `const ${component.outputs[0].variable} = ${inputConnections[0].fromSocket?.variable ?? ""} * ${inputConnections[1].fromSocket?.variable ?? ""};\n`;
            }
            return "";
        }
    },
    ...dslToLib(libInput)
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
    toObject: () => [components: VComponent[], connections: Connection[]],
    fromObject: (object: [components: VComponent[], connections: Connection[]] | undefined) => void,
}

export const VisualWrapper: FC = (props) => {
    const [libraryComponents, setLibraryComponents] = useState<LibraryComponent[]>(initialLibraryComponents);
    const [components, setComponents] = useState<VComponent[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);

    console.log(dslToLib(libInput));

    function toObject(): [components: VComponent[], connections: Connection[]] {
        return [
            components,
            connections
        ]
    }

    function fromObject(object: [components: VComponent[], connections: Connection[]]): void {
        if (object) {
            setComponents(object[0]);
            setConnections(object[1]);
        } else {
            setComponents([]);
            setConnections([]);
        }
    }

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
                    <ObjectContext.Provider value={{toObject, fromObject}}>
                        {props.children}
                    </ObjectContext.Provider>
                </LibraryContext.Provider>
            </ConnectionContext.Provider>
        </ComponentContext.Provider>
    )
}

export function useVisual(): Visual {
    const {libraryComponents, setLibraryComponents} = useContext(LibraryContext);
    const {components, setComponents, updateComponent, getComponentById} = useContext(ComponentContext);
    const {connections, setConnections} = useContext(ConnectionContext);
    const {toObject, fromObject} = useContext(ObjectContext);

    return {
        libraryComponents,
        setLibraryComponents,
        components,
        setComponents,
        updateComponent,
        connections,
        setConnections,
        getComponentById,
        toObject,
        fromObject,
    }
}