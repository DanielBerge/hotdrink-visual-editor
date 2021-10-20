import {useState} from "react";
import {exportToHTML} from "../exports/exportToHTML";
import {Modal} from "@mui/material";
import {HTMLView} from "../content/HTMLView";
import {useElements} from "../wrappers/ElementsWrapper";
import {Elem} from "../types";
import {upperCaseFirst} from "../utils";

export const Properties = () => {
    const elements = useElements()
    const [open, setOpen] = useState(false);

    const inputs = ["value", "height", "width"]

    return (
        <>
            <button
                className="h-10 bg-red-800 text-white p-2 disabled:opacity-50"
                onClick={() => setOpen(true)}
            >Run
            </button>
            <h1 className={"font-bold text-lg"}>Properties</h1>
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
                return <div key={key}>{upperCaseFirst(key)}: {elements.current[key as keyof Elem]}</div>
            })}
            <Modal
                open={open}
                onBackdropClick={() => setOpen(false)}
            >
                <div className="w-2/3 h-2/3 bg-gray-200 p-20">
                    <HTMLView HTML={exportToHTML(elements.elements)}/>
                </div>
            </Modal>
        </>
    )
}