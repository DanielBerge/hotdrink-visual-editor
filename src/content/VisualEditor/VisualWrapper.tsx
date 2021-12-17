import React, {FC, useContext, useState} from "react";
import {Connection, LibraryComponent, VComponent} from "../../types";

const ComponentContext = React.createContext<any>({})
const ConnectionContext = React.createContext<any>({})
const LibraryContext = React.createContext<any>({})
const ObjectContext = React.createContext<any>({})

const libInput = [{
    label: "Add",inputs:[],output: "Add", params: [{name: "textBox"}],codeLine: "a + textBox"}, {
    label: "Division",inputs:[{variable: "divisor"}, {variable: "dividend"}],output: "Division", params: [],codeLine: "dividend / divisor"}, {
    label: "Subtract",inputs:[{variable: "num1"}, {variable: "num2"}],output: "Subtract", params: [],codeLine: "num1 - num2"}, {
    label: "Multiplication",inputs:[{variable: "num1"}, {variable: "num2"}],output: "Multiplication", params: [],codeLine: "num1 * num2"}, {
    label: "Modulo",inputs:[{variable: "divisor"}, {variable: "dividend"}],output: "Modulo", params: [],codeLine: "dividend % divisor"}, {
    label: "LessThan",inputs:[{variable: "num1"}, {variable: "num2"}],output: "LessThan", params: [],codeLine: "num1 < num2"}, {
    label: "BiggerThan",inputs:[{variable: "num1"}, {variable: "num2"}],output: "BiggerThan", params: [],codeLine: "num1 > num2"}, {
    label: "Length",inputs:[{variable: "str"}],output: "Length", params: [],codeLine: "str.length"}, {
    label: "Concat",inputs:[{variable: "str"}],output: "Concat", params: [{name: "textBox", type: "textbox"}],codeLine: "textBox.concat(str);"}, {
    label: "And",inputs:[{variable: "bool1"}, {variable: "bool2"}],output: "And", params: [],codeLine: "(bool1 === \"true\") && (bool2 === \"true\")"}]

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
        lib.params = lib.params.map((param: any, index: number) => {
            return {
                id: index,
                name: param.name,
                type: param.type,
            }
        })
        lib.id = "lib-" + freshIndex++;
        lib.code = (inputConnections: Connection[], component: VComponent) => {
            lib.inputs.forEach((input: any, index: number) => {
                codeStr = codeStr.replace(input.variable, inputConnections[index]?.fromSocket?.variable ?? input.variable);
            })
            if (inputConnections.length >= 1 && component.outputs?.length === 1) {
                return `const ${component.outputs[0].variable} = ${codeStr}\n`
            }
            return "";
        }
        return lib;
    });
}

export interface Visual {
    libraryComponents: LibraryComponent[];
    setLibraryComponents: (libraryComponents: LibraryComponent[]) => void;
    components: VComponent[],
    setComponents: (components: VComponent[]) => void,
    updateComponent: (oldComponent: VComponent, newComponent: VComponent) => void,
    deleteComponent: (component: VComponent) => void,
    connections: Connection[],
    setConnections: (connections: Connection[]) => void,
    deleteConnection: (connection: Connection) => void,
    getComponentById: (id: string) => VComponent,
    toObject: () => [components: VComponent[], connections: Connection[]],
    fromObject: (object: [components: VComponent[], connections: Connection[]] | undefined) => void,
}

export const VisualWrapper: FC = (props) => {
    const [libraryComponents, setLibraryComponents] = useState<LibraryComponent[]>(dslToLib(libInput));
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

    function deleteComponent(toDelete: VComponent) {
        const newComponents = components.filter(component => toDelete.id !== component.id);
        const newConnections = connections.filter(connection => toDelete.id !== connection.fromSocket?.id && toDelete.id !== connection.toSocket?.id);
        setComponents(newComponents);
        setConnections(newConnections);
    }

    function deleteConnection(toDelete: Connection) {
        const newConnections = connections.filter(connection => toDelete.fromComponentId !== connection.fromComponentId && toDelete.toComponentId !== connection.toComponentId);
        setConnections(newConnections);
    }

    function getComponentById(id: string): VComponent | undefined {
        return components.find(component => component.id === id);
    }

    return (
        <ComponentContext.Provider
            value={{components, setComponents, updateComponent, getComponentById, deleteComponent}}>
            <ConnectionContext.Provider value={{connections, setConnections, deleteConnection}}>
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
    const {
        components,
        setComponents,
        updateComponent,
        getComponentById,
        deleteComponent
    } = useContext(ComponentContext);
    const {connections, setConnections, deleteConnection} = useContext(ConnectionContext);
    const {toObject, fromObject} = useContext(ObjectContext);

    return {
        libraryComponents,
        setLibraryComponents,
        components,
        setComponents,
        updateComponent,
        deleteComponent,
        connections,
        setConnections,
        deleteConnection,
        getComponentById,
        toObject,
        fromObject,
    }
}