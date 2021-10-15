import React, {FC} from "react";
import {useConstraints} from "../wrappers/ConstraintsWrapper";

export const Constraints: FC = () => {
    const constraints = useConstraints();

    function onCreate() {
        constraints.setNewConstraint(true);
    }

    return (
        <>
            <h1>Constraints</h1>
            <button
                className="h-10 bg-red-800 text-white p-2 disabled:opacity-50"
                onClick={onCreate}
                disabled={constraints.newConstraint}
            >Create constraint
            </button>
        </>
    )
}