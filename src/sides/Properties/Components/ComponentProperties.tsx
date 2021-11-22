import {upperCaseFirst} from "../../../utils";
import {Binding, Elem, InputType} from "../../../types";
import {ComponentDropDown} from "./ComponentDropDown";
import {useElements} from "../../../wrappers/ElementsWrapper";
import {useConstraints} from "../../../wrappers/ConstraintsWrapper";
import {ChangeEvent} from "react";

export const ComponentProperties = () => {
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
                if (constraint.toIds.includes(oldId) || constraint.fromIds.includes(oldId)) {
                    constraints.updateConstraint(constraint, {
                        ...constraint,
                        toIds: constraint.toIds.map(id => id === oldId ? e.target.value : id),
                        fromIds: constraint.fromIds.map(id => id === oldId ? e.target.value : id),
                        methods: constraint.methods.map(method => {
                            return method.outputId === oldId ? {
                                ...method,
                                outputId: e.target.value,
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
        <>
            {elements.current && <h1 className="font-bold">Component</h1>}
            {elements.current && Object.keys(elements.current).map((key: string) => {
                if (inputs.includes(key)) {
                    return (
                        <div key={key}>
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
                return <div key={key}>{upperCaseFirst(key)}: {elements.current[key as keyof Elem]}</div>
            })}
        </>
    )
}