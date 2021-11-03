import {upperCaseFirst} from "../../../utils";
import {Binding, Elem, InputType} from "../../../types";
import {ComponentDropDown} from "./ComponentDropDown";
import {useElements} from "../../../wrappers/ElementsWrapper";

export const ComponentProperties = () => {
    const elements = useElements();
    const inputs = ["value", "height", "width"]

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
                                    elements.setCurrent(
                                        elements.updateElement(elements.current, {
                                            ...elements.current,
                                            [key]: e.target.value,
                                        })
                                    );
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