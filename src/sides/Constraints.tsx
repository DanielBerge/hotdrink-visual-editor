import React, {FC} from "react";
import {useConstraints} from "../wrappers/ConstraintsWrapper";
import {sideOffset} from "./Components";

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
            <div
                draggable
                className="w-24 bg-red p-3 m-1"
                onDragEnd={(event => {
                    constraints.setConstraints([
                        ...constraints.constraints,
                        {
                            x: event.clientX - sideOffset,
                            y: event.clientY,
                            width: 100,
                            height: 100,
                            fromIds: [],
                            toIds: [],
                            methods: [],
                        }
                    ])
                })}
            >Constraint
            </div>
        </>
    )
}