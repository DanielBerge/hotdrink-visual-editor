import {useConstraints} from "../../../wrappers/ConstraintsWrapper";
import {upperCaseFirst} from "../../../utils";
import {Constraint} from "../../../types";


export const ConstraintProperties = () => {
    const constraints = useConstraints();

    return (
        <>
            {constraints.current && <h1 className="font-bold">Constraint</h1>}
            {constraints.current && Object.keys(constraints.current).map((key: string) => {
                if (key === "fromIds" || key === "toIds") {
                    return <div
                        key={key}>{upperCaseFirst(key)}: {(constraints.current![key as keyof Constraint] as any).join(", ")}</div>
                }
                if (key === "methods") return null;
                return <div key={key}>{upperCaseFirst(key)}: {constraints.current![key as keyof Constraint]}</div>
            })}
        </>
    )
}