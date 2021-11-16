import React, {FC, useContext, useState} from "react";
import {Constraint, EditorType, VMethod} from "../types";

const initialConstraints: Constraint[] = [
    {
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        fromIds: ["celcius", "fahrenheit"],
        toIds: ["fahrenheit", "celcius"],
        methods: [
            {
                id: "1",
                type: EditorType.VISUAL,
                code: "return celcius * (9/5) + 32",
                outputIds: ["fahrenheit"],
            },
            {
                id: "2",
                type: EditorType.VISUAL,
                code: "return (fahrenheit - 32) * (5/9)",
                outputIds: ["celcius"],
            },
        ]
    }
]

const ConstraintContext = React.createContext<any>({})
const NewConstraintContext = React.createContext<any>(false);
const CurrentContext = React.createContext<any>({});

export interface ConstraintsWrapperProps {
    constraints: Constraint[];
    setConstraints: (constraints: Constraint[]) => void;
    updateConstraint: (oldConstraint: Constraint, newConstraint: Constraint) => Constraint;
    newConstraint: boolean;
    setNewConstraint: (newConstraint: boolean) => void;
    current: Constraint | undefined;
    setCurrent: (newConstraint: Constraint | undefined) => void;
    deleteConstraintsConnected: (elementId: string) => void;
    currentMethod: VMethod | undefined;
    setCurrentMethod: (method: VMethod | undefined) => void;
    updateMethod: (oldMethod: VMethod, newMethod: VMethod, constraint: Constraint) => VMethod;
}

const ConstraintsWrapper: FC = (props) => {
    const [constraints, setConstraints] = useState(initialConstraints);
    const [newConstraint, setNewConstraint] = useState(false);
    const [current, setCurrent] = useState(undefined);
    const [currentMethod, setCurrentMethod] = useState(undefined);

    function updateConstraint(oldConstraint: Constraint, newConstraint: Constraint) {
        const index = constraints.findIndex((constraint) => constraint.fromIds === oldConstraint.fromIds && constraint.toIds === oldConstraint.toIds);
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
        console.log(constraints[index].methods);
        return newMethod;
    }

    function deleteConstraintsConnected(elementId: string) {
        //TODO Kan være feil
        setConstraints(constraints.filter((constraint) => constraint.toIds.includes(elementId) || constraint.fromIds.includes(elementId)));
    }

    return (
        <ConstraintContext.Provider value={{constraints, setConstraints, updateConstraint, deleteConstraintsConnected}}>
            <NewConstraintContext.Provider value={{newConstraint, setNewConstraint}}>
                <CurrentContext.Provider value={{current, setCurrent, currentMethod, setCurrentMethod, updateMethod}}>
                    {props.children}
                </CurrentContext.Provider>
            </NewConstraintContext.Provider>
        </ConstraintContext.Provider>
    )
}

function useConstraints(): ConstraintsWrapperProps {
    const {constraints, setConstraints, updateConstraint, deleteConstraintsConnected} = useContext(ConstraintContext);
    const {newConstraint, setNewConstraint} = useContext(NewConstraintContext);
    const {current, setCurrent, currentMethod, setCurrentMethod, updateMethod} = useContext(CurrentContext);

    return {
        constraints,
        setConstraints,
        updateConstraint,
        newConstraint,
        setNewConstraint,
        current,
        setCurrent,
        deleteConstraintsConnected,
        currentMethod,
        setCurrentMethod,
        updateMethod,
    }
}

export {ConstraintsWrapper, useConstraints};