import {useConstraints} from "../../../wrappers/ConstraintsWrapper";
import {upperCaseFirst} from "../../../utils";
import {Constraint} from "../../../types";
import {ConstraintDropDown} from "./ConstraintDropDown";


export const ConstraintProperties = () => {
    const constraints = useConstraints();

    return (
        <>
            {constraints.current && <h1 className="font-bold">Constraint</h1>}
            {constraints.current && Object.keys(constraints.current).map((key: string) => {
                if (key === "fromIds" || key === "toIds") {
                    return <div key={key}>{upperCaseFirst(key)}: {(constraints.current![key as keyof Constraint] as any).join(", ")}</div>
                }
                if (key === "methods") return null;
                //TODO Print out correctly
                /**
                 if (key === "method") {
                    return (
                        <div key={key}>
                            <p>{upperCaseFirst(key)}: </p>
                            <code
                                className={"block whitespace-pre border border-black p-2"}>{constraints.current![key as keyof Constraint] as string}</code>
                        </div>
                    )
                }
                 if (key === "visualJson") return <div key={key}/>;
                 **/
                return <div key={key}>{upperCaseFirst(key)}: {constraints.current![key as keyof Constraint]}</div>
            })}
        </>
    )
}