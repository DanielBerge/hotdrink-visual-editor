import {lowerCaseFirst, upperCaseFirst} from "../../../utils";
import {Binding, Elem, InputType} from "../../../types";
import {FC} from "react";
import {useElements} from "../../../wrappers/ElementsWrapper";

interface Props {
    elemKey: string;
    type: typeof InputType | typeof Binding;
}

export const ComponentDropDown: FC<Props> = ({elemKey, type}) => {
    const elements = useElements();

    return (
        <div key={elemKey} className="flex">
            <div>{upperCaseFirst(elemKey)}: </div>
            <select
                value={elements.current[elemKey as keyof Elem]}
                onChange={(e) => {
                    elements.setCurrent(
                        elements.updateElement(elements.current, {
                            ...elements.current,
                            [elemKey as keyof typeof type]: e.target.value,
                        })
                    );
                }}
            >
                {Object.keys(type).map((type, key) => {
                    return <option key={key} value={lowerCaseFirst(type)}>{type}</option>
                })}
            </select>
        </div>
    );

}