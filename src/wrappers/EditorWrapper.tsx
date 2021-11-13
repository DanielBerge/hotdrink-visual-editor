import React, {FC, useContext, useState} from "react";
import {useConstraints} from "./ConstraintsWrapper";
import {EditorType} from "../types";


const TypeContext = React.createContext<any>({});

interface Editor {
    type: EditorType;
    setType: (type: EditorType) => void;
}


const EditorWrapper: FC = (props) => {
    const [type, setType] = useState(EditorType.VISUAL);

    return (
        <TypeContext.Provider value={{type, setType}}>
            {props.children}
        </TypeContext.Provider>
    )
}

function useEditor(): Editor {
    const {type, setType} = useContext(TypeContext);

    return {
        type,
        setType,
    }
}

export {EditorWrapper, useEditor};