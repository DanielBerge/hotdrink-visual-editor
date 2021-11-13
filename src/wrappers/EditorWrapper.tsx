import React, {FC, useContext, useState} from "react";
import {useConstraints} from "./ConstraintsWrapper";
import {EditorType} from "../types";


const EditorContext = React.createContext<any>({});
const TypeContext = React.createContext<any>({});

interface Editor {
    code: string,
    setCode: (code: string) => void;
    type: EditorType;
    setType: (type: EditorType) => void;
}


const EditorWrapper: FC = (props) => {
    const constraints = useConstraints();
    //TODO Use correct method or remove code
    const [code, setCode] = useState(constraints.current?.methods[0].code ?? "");
    const [type, setType] = useState(EditorType.VISUAL);

    return (
        <EditorContext.Provider value={{code, setCode}}>
            <TypeContext.Provider value={{type, setType}}>
                {props.children}
            </TypeContext.Provider>
        </EditorContext.Provider>
    )
}

function useEditor(): Editor {
    const {code, setCode} = useContext(EditorContext);
    const {type, setType} = useContext(TypeContext);

    return {
        code,
        setCode,
        type,
        setType,
    }
}

export {EditorWrapper, useEditor};