import React, {FC} from "react";
import {useConstraints} from "../wrappers/ConstraintsWrapper";
import {CancelConfirm} from "./Properties/CancelConfirm";
import {ConstraintProperties} from "./Properties/Constraints/ConstraintProperties";

export const Constraints: FC = () => {
    const constraints = useConstraints();
    const [name, setName] = React.useState("");

    function onCreate() {
        constraints.setNewConstraint(true);
    }

    return (
        <>
            <h1 className="font-bold text-lg">
                Constraints
            </h1>
            <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 m-1"
                onClick={onCreate}
                disabled={constraints.newConstraint}
            >Create constraint
            </button>
            {constraints.newConstraint &&
                <CancelConfirm
                    onCancel={() => constraints.cancelNewConstraint()}
                    onConfirm={constraints.createConstraint}
                />
            }
            {constraints.current &&
                <div>
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 m-1"
                        onClick={() => constraints.setNewMethod(true)}
                        disabled={constraints.newMethod}
                    >Create method
                    </button>
                    {constraints.newMethod &&
                        <div>
                            <label htmlFor={"name"}>Method name:</label>
                            <input id={"name"} onChange={(e) => setName(e.target.value)}/>
                            <CancelConfirm
                                onCancel={() => constraints.cancelNewMethod()}
                                onConfirm={() => {
                                    constraints.createMethod(name);
                                }}
                            />
                        </div>
                    }
                </div>
            }
            <ConstraintProperties/>
            {constraints.current && (
                <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 m-1"
                    onClick={() => {
                        constraints.deleteConstraint(constraints.current);
                        constraints.setCurrent(undefined);
                    }}
                >Delete constraint
                </button>
            )}
        </>
    )
}