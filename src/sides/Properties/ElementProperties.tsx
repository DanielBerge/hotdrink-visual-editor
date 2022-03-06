import {upperCaseFirst} from "../../utils";
import {Binding, Elem, InputType} from "../../types";
import {ComponentDropDown} from "./ComponentDropDown";
import {useElements} from "../../wrappers/ElementsWrapper";
import {useConstraints} from "../../wrappers/ConstraintsWrapper";
import React, {ChangeEvent} from "react";
import {RoundBox} from "../RoundBox";

export const ElementProperties  = () => {
    const elements = useElements();
    const constraints = useConstraints();
    const inputs = ["value", "height", "width", "id"]

    function updateId(e: ChangeEvent<HTMLInputElement>, oldId: string) {
        const exists = elements.elements.find(element => element.id === e.target.value);
        if (exists) {
            alert("Element with this id already exists");
            return;
        } else {
            updateKey(e, "id");
            constraints.constraints.forEach((constraint) => {
                if (constraint.methods.some((method) => method.toIds.includes(oldId)) || constraint.fromIds.includes(oldId)) {
                    constraints.updateConstraint(constraint, {
                        ...constraint,
                        fromIds: constraint.fromIds.map(id => id === oldId ? e.target.value : id),
                        methods: constraint.methods.map(method => {
                            return method.toIds.includes(oldId) ? {
                                ...method,
                                toIds: method.toIds.map(id => id === oldId ? e.target.value : id),
                                code: method.code.replaceAll(oldId, e.target.value),
                            } : {
                                ...method,
                                code: method.code.replaceAll(oldId, e.target.value),
                            }
                        }),
                    })
                }
            })
        }
    }

    function updateKey(e: ChangeEvent<HTMLInputElement>, key: string) {
        elements.setCurrent(
            elements.updateElement(elements.current, {
                ...elements.current,
                [key]: e.target.value,
            })
        );
    }

    return (
        <RoundBox>
            {!elements.current && <h1 className="font-bold">No selected element</h1>}
            {elements.current &&
                <>
                    <h1 className="font-bold">Element</h1>
                    {Object.keys(elements.current).map((key: string) => {
                        if (inputs.includes(key)) {
                            return (
                                <div key={key} className={"p-1"}>
                                    <label>{upperCaseFirst(key)}: </label>
                                    <input
                                        value={elements.current[key as keyof Elem]}
                                        onChange={(e) => {
                                            if (key === "id") {
                                                updateId(e, elements.current.id);
                                            } else {
                                                updateKey(e, key);
                                            }
                                        }}
                                        className={"border w-20"}
                                    />
                                </div>
                            )
                        }
                        if (key === "subType") {
                            return (
                                <ComponentDropDown key={key} elemKey={key} type={InputType}/>
                            );
                        }
                        if (key === "binding") {
                            return (
                                <ComponentDropDown key={key} elemKey={key} type={Binding}/>
                            );
                        }
                        return <div className={"p-1"} key={key}>{upperCaseFirst(key)}: {elements.current[key as keyof Elem]}</div>
                    })}
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 m-1"
                        onClick={() => {
                            elements.deleteElement(elements.current.id);
                            constraints.deleteConstraintsConnected(elements.current.id);
                            elements.setCurrent(undefined);
                        }}
                    >Delete element
                    </button>
                </>
            }
        </RoundBox>
    )
}