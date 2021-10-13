import React, {FC, useContext, useState} from "react";
import {Constraint} from "../types";

const initialConstraints: Constraint[] = [
    {
        fromId: "initial",
        toId: "initial2",
        code: "const positive = initial >= 0;\n" +
            "return positive;"
    }
]

const ConstraintContext = React.createContext<any>({})
const NewConstraintContext = React.createContext<any>(false);

interface Constraints {
    constraints: Constraint[];
    setConstraints: (constraints: Constraint[]) => void;
    updateConstraint: (oldConstraint: Constraint, newConstraint: Constraint) => void
    newConstraint: boolean;
    setNewConstraint: (newConstraint: boolean) => void;
}

export const ConstraintsWrapper: FC = (props) => {
    const [constraints, setConstraints] = useState(initialConstraints);
    const [newConstraint, setNewConstraint] = useState(false);

    function updateConstraint(oldConstraint: Constraint, newConstraint: Constraint) {
        const index = constraints.findIndex((constraint) => constraint.fromId === oldConstraint.fromId && constraint.toId === oldConstraint.toId);
        if (index !== -1) {
            constraints[index] = newConstraint;
            setConstraints(constraints);
        } else {
            console.warn("Could not find element to update");
        }
    }

    return (
        <ConstraintContext.Provider value={{constraints, setConstraints, updateConstraint}}>
            <NewConstraintContext.Provider value={{newConstraint, setNewConstraint}}>
                {props.children}
            </NewConstraintContext.Provider>
        </ConstraintContext.Provider>
    )
}

export function useConstraints(): Constraints {
    const {constraints, setConstraints, updateConstraint} = useContext(ConstraintContext);
    const {newConstraint, setNewConstraint, } = useContext(NewConstraintContext);

    return {
        constraints,
        setConstraints,
        updateConstraint,
        newConstraint,
        setNewConstraint,
    }
}