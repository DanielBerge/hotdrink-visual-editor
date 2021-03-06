import React, {FC, useContext, useState} from "react";
import {Constraint, EditorType, Elem, VMethod} from "../types";
import {useAlert} from "./AlertWrapper";

let index: number = 0;
function freshId(): string {
    return `M${++index}`;
}

const ConstraintContext = React.createContext<any>({})
const NewContext = React.createContext<any>(false);
const CurrentContext = React.createContext<any>({});

export interface ConstraintsWrapperProps {
    constraints: Constraint[];
    setConstraints: (constraints: Constraint[]) => void;
    updateConstraint: (oldConstraint: Constraint, newConstraint: Constraint) => Constraint;
    newConstraint: boolean;
    setNewConstraint: (newConstraint: boolean) => void;
    toggleElementToNewConstraint: (id: string) => void;
    currentElements: string[];
    cancelNewConstraint: () => void;
    createConstraint: (elements: Elem[]) => Constraint;
    deleteConstraint: (constraint: Constraint | undefined) => void;
    current: Constraint | undefined;
    setCurrent: (newConstraint: Constraint | undefined) => void;
    deleteConstraintsConnected: (elementId: string) => void;
    newMethod: boolean;
    setNewMethod: (newMethod: boolean) => void;
    toggleElementToNewMethod: (id: string) => void;
    cancelNewMethod: () => void;
    createMethod: (name: string) => VMethod;
    currentMethod: VMethod | undefined;
    setCurrentMethod: (method: VMethod | undefined) => void;
    updateMethod: (oldMethod: VMethod, newMethod: VMethod, constraint: Constraint) => VMethod;
    deleteMethod: (method: VMethod) => void;
}

const ConstraintsWrapper: FC = (props) => {
    const alert = useAlert();
    const [constraints, setConstraints] = useState<Constraint[]>([]);
    const [newConstraint, setNewConstraintValue] = useState(false);
    const [newMethod, setNewMethodValue] = useState<boolean>(false);
    const [current, setCurrent] = useState<Constraint | undefined>(undefined);
    const [currentMethod, setCurrentMethod] = useState<VMethod | undefined>(undefined);
    const [currentElements, setCurrentElements] = useState<string[]>([]);

    function setNewConstraint(newConstraint: boolean) {
        if (newConstraint) {
            alert.setMessage("Click on the elements you want to add a constraint to.");
        } else {
            alert.clearMessages();
        }
        setNewConstraintValue(newConstraint);
    }

    function setNewMethod(newMethod: boolean) {
        if (newMethod) {
            alert.setMessage("Click on the elements you want to add a method output connection to.");
        } else {
            alert.clearMessages();
        }
        setNewMethodValue(newMethod);
    }

    function cancelNewConstraint() {
        setCurrentElements([]);
        setNewConstraint(false);
    }

    function cancelNewMethod() {
        setCurrentElements([]);
        setNewMethod(false);
    }

    function toggleElementToNewConstraint(id: string) {
        if (currentElements.includes(id)) {
            setCurrentElements(currentElements.filter(e => e !== id));
        } else {
            setCurrentElements([...currentElements, id]);
        }
    }

    function toggleElementToNewMethod(id: string) {
        if (currentElements.includes(id)) {
            setCurrentElements(currentElements.filter(e => e !== id));
        } else {
            setCurrentElements([...currentElements, id]);
        }
    }

    function createMethod(name: string) {
        if (current) {
            if (current.methods.some(method => currentElements.every((element) => method.toIds.includes(element)))) {
                alert.setError("A method in the constraint already connects to the selected elements.");
                setCurrentElements([]);
                return;
            }
            if (currentElements.length === 0) {
                alert.setError("No elements selected.");
                return;
            }
            if (current?.methods.some(m => m.id === name)) {
                alert.setError("Method with this name already exists");
                return;
            }
            if (name.length === 0) {
                name = freshId();
            }
            const newMethod = {
                id: name,
                type: EditorType.VISUAL,
                code: "",
                toIds: currentElements,
            }
            setCurrentElements([]);
            setCurrentMethod(newMethod);
            setNewMethod(false);

            const newMethods = [...current.methods, newMethod];
            const longestMethodName = getLongestMethodName(newMethods);

            setCurrent(
                updateConstraint(current, {
                    ...current,
                    methods: newMethods,
                    width: longestMethodName > 6 ? (longestMethodName - 6) * 7 + 100 : 100,
                    height: newMethods.length > 3 ? (newMethods.length - 3) * 30 + 100 : 100,
                })
            );
        }
    }

    function getLongestMethodName(methods: VMethod[]) {
        return methods.reduce((acc, cur) => {
            if (cur.id.length > acc) {
                return cur.id.length;
            }
            return acc;
        }, 0);
    }


    function deleteMethod(method: VMethod) {
        if (current) {
            const newMethods = current.methods.filter(m => m.id !== method.id);
            const longestMethodName = getLongestMethodName(newMethods);
            updateConstraint(current, {
                ...current,
                methods: newMethods,
                width: longestMethodName > 6 ? (longestMethodName - 6) * 7 + 100 : 100,
                height: newMethods.length > 3 ? (newMethods.length - 3) * 30 + 100 : 100,
            });
            setCurrent(undefined);
        }
    }

    function createConstraint(elements: Elem[]) {
        if (currentElements.length === 0) {
            alert.setError("No elements selected.");
            return;
        }
        const selectedElements = elements.filter(e => currentElements.includes(e.id));
        const xPos = selectedElements.reduce((acc, cur) => acc + cur.x, 0) / selectedElements.length;
        const yPos = selectedElements.reduce((acc, cur) => acc + cur.y, 0) / selectedElements.length;

        const newConstraint: Constraint = {
            x: xPos,
            y: yPos,
            width: 100,
            height: 100,
            fromIds: currentElements,
            methods: [],
        };
        setCurrentElements([]);
        setConstraints([...constraints, newConstraint]);
        setNewConstraint(false);
        setCurrent(newConstraint);
    }

    function updateConstraint(oldConstraint: Constraint, newConstraint: Constraint) {
        const index = constraints.findIndex((constraint) => constraint.fromIds === oldConstraint.fromIds && constraint.methods === oldConstraint.methods);
        if (index !== -1) {
            constraints[index] = newConstraint;
            setConstraints(constraints);
        } else {
            console.warn("Could not find constraint to update");
        }
        return newConstraint;
    }

    function updateMethod(oldMethod: VMethod, newMethod: VMethod, constraint: Constraint) {
        const index = constraints.findIndex((thisConstraint) => thisConstraint === constraint);
        if (index !== -1) {
            constraints[index].methods = constraints[index].methods.map((method) => method.id === oldMethod.id ? newMethod : method);
            setConstraints(constraints);
        } else {
            console.warn("Could not find method to update");
        }
        return newMethod;
    }

    function deleteConstraint(toDelete: Constraint) {
        const newConstraints = constraints.filter((constraint) => constraint.fromIds !== toDelete.fromIds && constraint.methods !== toDelete.methods);
        setConstraints(newConstraints);
        setNewConstraint(false);
        setNewMethod(false);
    }

    function deleteConstraintsConnected(elementId: string) {
        setConstraints(constraints.filter((constraint) => !constraint.fromIds.includes(elementId) && !constraint.methods.some((method) => method.toIds.includes(elementId))));
    }

    return (
        <ConstraintContext.Provider
            value={{
                constraints,
                setConstraints,
                updateConstraint,
                deleteConstraintsConnected,
                deleteConstraint,
                createConstraint
            }}>
            <NewContext.Provider value={{newConstraint, setNewConstraint, newMethod, setNewMethod}}>
                <CurrentContext.Provider value={{
                    current,
                    setCurrent,
                    currentMethod,
                    setCurrentMethod,
                    updateMethod,
                    toggleElementToNewConstraint,
                    toggleElementToNewMethod,
                    createMethod,
                    deleteMethod,
                    currentElements,
                    cancelNewConstraint,
                    cancelNewMethod,
                }}>
                    {props.children}
                </CurrentContext.Provider>
            </NewContext.Provider>
        </ConstraintContext.Provider>
    )
}

function useConstraints(): ConstraintsWrapperProps {
    const {
        constraints,
        setConstraints,
        updateConstraint,
        deleteConstraintsConnected,
        deleteConstraint,
        createConstraint,
    } = useContext(ConstraintContext);
    const {newConstraint, setNewConstraint, newMethod, setNewMethod} = useContext(NewContext);
    const {
        current,
        setCurrent,
        currentMethod,
        setCurrentMethod,
        updateMethod,
        toggleElementToNewConstraint,
        toggleElementToNewMethod,
        currentElements,
        cancelNewConstraint,
        cancelNewMethod,
        createMethod,
        deleteMethod,
    } = useContext(CurrentContext);

    return {
        constraints,
        setConstraints,
        updateConstraint,
        newConstraint,
        setNewConstraint,
        deleteConstraint,
        current,
        setCurrent,
        deleteConstraintsConnected,
        currentMethod,
        setCurrentMethod,
        updateMethod,
        createConstraint,
        currentElements,
        toggleElementToNewConstraint,
        cancelNewConstraint,
        cancelNewMethod,
        newMethod,
        setNewMethod,
        toggleElementToNewMethod,
        createMethod,
        deleteMethod,
    }
}

export {ConstraintsWrapper, useConstraints};