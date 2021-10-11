import React, {FC, useContext, useState} from "react";
import {NewConstraintContext} from "../App";

export const Constraints: FC = () => {
    const {newConstraint, setNewConstraint} = useContext(NewConstraintContext);

    function onCreate() {
        setNewConstraint(true);
    }

    return (
        <>
            <h1>Constraints</h1>
            <button
                className="h-10 bg-red-800 text-white p-2"
                onClick={onCreate}
                disabled={newConstraint}
            >Create constraint
            </button>
        </>
    )
}