import React, {FC} from "react";
import {useConstraints} from "../wrappers/ConstraintsWrapper";
import {CancelConfirm} from "./Properties/CancelConfirm";

export const Constraints: FC = () => {
    const constraints = useConstraints();

    function onCreate() {
        constraints.setNewConstraint(true);
    }

    return (
        <>
            <h1 className="font-bold text-lg">
                Constraints
            </h1>
            <button
                className="h-10 bg-red-800 text-white p-2 disabled:opacity-50"
                onClick={onCreate}
                disabled={constraints.newConstraint}
            >Create constraint
            </button>
            <CancelConfirm
                onCancel={() => constraints.setNewConstraint(false)}
                onConfirm={constraints.createConstraint}
            />
        </>
    )
}