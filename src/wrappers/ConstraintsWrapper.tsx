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

interface Constraints {
    constraints: Constraint[];
    setConstraints: (constrains: Constraint[]) => void;
    updateConstraint: (oldConstraint: Constraint, newConstraint: Constraint) => void
}

export const ConstraintsWrapper: FC = (props) => {
    const [constraints, setConstraints] = useState(initialConstraints);

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
            {props.children}
        </ConstraintContext.Provider>
    )
}

export function useConstraints(): Constraints {
    const {constraints, setConstraints, updateConstraint} = useContext(ConstraintContext);

    return {
        constraints,
        setConstraints,
        updateConstraint,
    }
}