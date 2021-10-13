import {useState} from "react";
import {exportToHTML} from "../exports/exportToHTML";
import {Modal} from "@mui/material";
import {HTMLView} from "../content/HTMLView";
import {useElements} from "../wrappers/ElementsWrapper";

export const Properties = () => {
    const elements = useElements()
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                className="h-10 bg-red-800 text-white p-2 disabled:opacity-50"
                onClick={() => setOpen(true)}
            >Run
            </button>
            <h1>Properties</h1>
            {elements.current && Object.keys(elements.current).map((key: string) => {
                // @ts-ignore
                return <div key={key}>{key}: {elements.current[key]}</div>
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