import React, {FC, useContext, useState} from "react";
import {Constraint, EditorType, VMethod} from "../types";

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
    createConstraint: () => Constraint;
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
}

const ConstraintsWrapper: FC = (props) => {
    const [constraints, setConstraints] = useState<Constraint[]>([]);
    const [newConstraint, setNewConstraint] = useState(false);
    const [newMethod, setNewMethod] = useState<boolean>(false);
    const [current, setCurrent] = useState<Constraint | undefined>(undefined);
    const [currentMethod, setCurrentMethod] = useState<VMethod | undefined>(undefined);
    const [currentElements, setCurrentElements] = useState<string[]>([]);

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
            if (current.methods.some(method => method.toIds.every((element) => currentElements.includes(element)))) {
                console.warn("Method already exists");
                return;
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
            updateConstraint(current, {
                ...current,
                methods: [...current.methods, newMethod]
            });
        }
    }

    function createConstraint() {
        const newConstraint: Constraint = {
            x: 0,
            y: 0,
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
    }
}

export {ConstraintsWrapper, useConstraints};