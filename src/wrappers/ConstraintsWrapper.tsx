import React, {FC, useContext, useState} from "react";
import {Constraint, EditorType} from "../types";

const initialConstraints: Constraint[] = [
    {
        fromId: "initial",
        toId: "initial2",
        type: EditorType.VISUAL,
        code: "const positive = initial >= 0;\n" +
            "return positive;"
    }
]

const ConstraintContext = React.createContext<any>({})
const NewConstraintContext = React.createContext<any>(false);
const CurrentContext = React.createContext<any>({});

interface Constraints {
    constraints: Constraint[];
    setConstraints: (constraints: Constraint[]) => void;
    updateConstraint: (oldConstraint: Constraint, newConstraint: Constraint) => Constraint;
    newConstraint: boolean;
    setNewConstraint: (newConstraint: boolean) => void;
    current: Constraint | undefined;
    setCurrent: (newConstraint: Constraint | undefined) => void;
    deleteConstraintsConnected: (elementId: string) => void;
}

const ConstraintsWrapper: FC = (props) => {
    const [constraints, setConstraints] = useState(initialConstraints);
    const [newConstraint, setNewConstraint] = useState(false);
    const [current, setCurrent] = useState(undefined);

    function updateConstraint(oldConstraint: Constraint, newConstraint: Constraint) {
        const index = constraints.findIndex((constraint) => constraint.fromId === oldConstraint.fromId && constraint.toId === oldConstraint.toId);
        if (index !== -1) {
            constraints[index] = newConstraint;
            setConstraints(constraints);
        } else {
            console.warn("Could not find element to update");
        }
        return newConstraint;
    }

    function deleteConstraintsConnected(elementId: string) {
        setConstraints(constraints.filter((constraint) => constraint.toId !== elementId && constraint.fromId !== elementId));
    }

    return (
        <ConstraintContext.Provider value={{constraints, setConstraints, updateConstraint, deleteConstraintsConnected}}>
            <NewConstraintContext.Provider value={{newConstraint, setNewConstraint}}>
                <CurrentContext.Provider value={{current, setCurrent}}>
                    {props.children}
                </CurrentContext.Provider>
            </NewConstraintContext.Provider>
        </ConstraintContext.Provider>
    )
}

function useConstraints(): Constraints {
    const {constraints, setConstraints, updateConstraint, deleteConstraintsConnected} = useContext(ConstraintContext);
    const {newConstraint, setNewConstraint} = useContext(NewConstraintContext);
    const {current, setCurrent} = useContext(CurrentContext);

    return {
        constraints,
        setConstraints,
        updateConstraint,
        newConstraint,
        setNewConstraint,
        current,
        setCurrent,
        deleteConstraintsConnected,
    }
}

export {ConstraintsWrapper, useConstraints};