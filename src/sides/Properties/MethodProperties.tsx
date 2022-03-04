import React, {FC, useState} from "react";
import {useConstraints} from "../../wrappers/ConstraintsWrapper";
import {VMethod} from "../../types";
import {upperCaseFirst} from "../../utils";
import {VisualWrapper} from "../../content/VisualEditor/VisualWrapper";
import {ConstraintEditor} from "../../content/ConstraintEditor";
import {RoundBox} from "../RoundBox";


export const MethodProperties: FC = () => {
    const constraints = useConstraints();
    const [open, setOpen] = useState(false);

    function onClose() {
        setOpen(false);
    }

    return (
        <>
            {constraints.current &&
                <RoundBox>
                    <h1 className={"font-bold"}>Methods</h1>
                    <div>
                        {constraints.current.methods.map((method: VMethod) => {
                            return <div key={method.id}>
                                {"Method " + upperCaseFirst(method.id) + ": "}
                                <button
                                    onClick={() => {
                                        constraints.setCurrentMethod(method);
                                        setOpen(true);
                                    }}
                                    className="m-1 p-1 bg-red-500 hover:bg-red-700 text-white font-bold px-1 rounded">
                                    Edit
                                </button>
                                <button
                                    onClick={() => {
                                        constraints.deleteMethod(method);
                                    }}
                                    className="m-1 p-1 bg-red-500 hover:bg-red-700 text-white font-bold px-1 rounded">
                                    Delete
                                </button>
                            </div>
                        })}
                    </div>
                </RoundBox>
            }
            <VisualWrapper>
                <ConstraintEditor
                    onClose={onClose}
                    open={open}
                />
            </VisualWrapper>
        </>
    );
}