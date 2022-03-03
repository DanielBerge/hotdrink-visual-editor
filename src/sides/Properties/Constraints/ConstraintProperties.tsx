import {useConstraints} from "../../../wrappers/ConstraintsWrapper";
import {upperCaseFirst} from "../../../utils";
import {Constraint, VMethod} from "../../../types";


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
                if (key === "methods") {
                    return <div>
                        {
                            constraints.current!.methods.map((method: VMethod) => {
                                return <div key={method.id}>
                                    {"Method " + upperCaseFirst(method.id) + ": "}
                                    <button
                                        onClick={() => {
                                            constraints.deleteMethod(method);
                                        }}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold px-1 rounded">
                                        x
                                    </button>
                                </div>
                            })
                        }
                    </div>
                }
                return <div key={key}>{upperCaseFirst(key)}: {constraints.current![key as keyof Constraint]}</div>
            })}
        </>
    )
}