import {lowerCaseFirst, upperCaseFirst} from "../../../utils";
import {Constraint} from "../../../types";
import {FC} from "react";
import {useConstraints} from "../../../wrappers/ConstraintsWrapper";
import {useElements} from "../../../wrappers/ElementsWrapper";

interface Props {
    constraintKey: string;
}

export const ConstraintDropDown: FC<Props> = ({constraintKey}) => {
    const constraints = useConstraints();
    const elements = useElements();

    //TODO Multiple constraints selection
    return (
        <div></div>
    )
    /**
    return (
        <div key={constraintKey} className="flex">
            <div>{upperCaseFirst(constraintKey)}:</div>
            <select
                value={constraints.current![constraintKey as keyof Constraint] as string}
                onChange={(e) => {
                    constraints.setCurrent(
                        constraints.updateConstraint(constraints.current!, {
                            ...constraints.current!,
                            [constraintKey as keyof Constraint]: e.target.value,
                        })
                    );
                }}
            >
                {Array.from(elements.elements.map((elem) => elem.id).filter((id) => {
                    if (constraints.current?.toId === constraints.current![constraintKey as keyof Constraint]) {
                        return id !== constraints.current!.fromId;
                    } else {
                        return id !== constraints.current!.toId;
                    }
                })).map((id, key) => {
                    return <option key={key} value={lowerCaseFirst(id)}>{id}</option>
                })}
            </select>
        </div>
    );
     **/
}