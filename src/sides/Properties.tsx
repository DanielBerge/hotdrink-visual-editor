import {CurrentContext} from "../App";
import {useContext} from "react";

export const Properties = () => {
    const {current,} = useContext(CurrentContext);

    return (
        <>
            <h1>Properties</h1>
            {current && Object.keys(current).map((key) => {
                return <div key={key}>{key}: {current[key]}</div>
            })}
        </>
    )
}