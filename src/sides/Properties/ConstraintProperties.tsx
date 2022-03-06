import {useConstraints} from "../../wrappers/ConstraintsWrapper";
import {upperCaseFirst} from "../../utils";
import {Constraint} from "../../types";
import React from "react";
import {RoundBox} from "../RoundBox";


export const ConstraintProperties = () => {
    const constraints = useConstraints();

    return (
        <RoundBox>
            {!constraints.current && <h1 className="font-bold">No selected constraint</h1>}
            {constraints.current && <>
                <h1 className="font-bold">Constraint</h1>
                {Object.keys(constraints.current).map((key: string) => {
                    if (key === "fromIds") {
                        return <div key={key} className={"p-1"}>
                            InputElements: {(constraints.current![key as keyof Constraint] as any).join(", ")}</div>
                    }
                    if (key === "methods") {
                        return;
                    }

                    return <div className={"p-1"}
                                key={key}>{upperCaseFirst(key)}: {constraints.current![key as keyof Constraint]}</div>
                })}
                <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 m-1"
                    onClick={() => {
                        constraints.deleteConstraint(constraints.current);
                        constraints.setCurrent(undefined);
                    }}
                >Delete constraint
                </button>
            </>}
        </RoundBox>
    )
}