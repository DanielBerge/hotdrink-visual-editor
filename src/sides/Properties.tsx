import {useState} from "react";
import {Modal} from "@mui/material";
import {HTMLView} from "../content/HTMLView";
import {useElements} from "../wrappers/ElementsWrapper";
import {Elem, InputType} from "../types";
import {lowerCaseFirst, upperCaseFirst} from "../utils";
import {HTMLBuilder} from "../exports/HTMLBuilder";
import {useConstraints} from "../wrappers/ConstraintsWrapper";
import JSZip from "jszip";
import { saveAs } from 'file-saver';


export const Properties = () => {
    const elements = useElements();
    const constraints = useConstraints();
    const [open, setOpen] = useState(false);

    const inputs = ["value", "height", "width"]

    return (
        <>
            <h1 className={"font-bold text-lg"}>Properties</h1>
            {elements.current && (
                <button
                    className="h-10 bg-red-800 text-white p-2 disabled:opacity-50"
                    onClick={() => {
                        elements.deleteElement(elements.current.id);
                        constraints.deleteConstraintsConnected(elements.current.id);
                        elements.setCurrent(undefined);
                    }}
                >Delete
                </button>
            )}
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
                if (key === "subType") {
                    return (
                        <div key={key} className="flex">
                            <div>{upperCaseFirst(key)}: </div>
                            <select
                                value={elements.current[key as keyof Elem]}
                                onChange={(e) => {
                                    elements.setCurrent(
                                        elements.updateElement(elements.current, {
                                            ...elements.current,
                                            [key as keyof InputType]: e.target.value,
                                        })
                                    );
                                }}
                            >
                                {Object.keys(InputType).map((type, key) => {
                                    return <option key={key} value={lowerCaseFirst(type)}>{type}</option>
                                })}
                            </select>
                        </div>
                    );
                }
                return <div key={key}>{upperCaseFirst(key)}: {elements.current[key as keyof Elem]}</div>
            })}
            <button
                className="h-10 bg-red-800 text-white p-2 disabled:opacity-50"
                onClick={() => setOpen(true)}
            >Run
            </button>
            <button
                className="h-10 bg-red-800 text-white p-2 disabled:opacity-50"
                onClick={async () => {
                    const zip = new JSZip();
                    let builder = new HTMLBuilder();
                    builder.includeHTML(elements.elements).includeJS(constraints.constraints).end();
                    zip.file("index.html", builder.build());

                    let response = await fetch("/hotdrink.js", {
                        method: "GET"
                    });
                    zip.file("hotdrink.js", await response.text())

                    zip.generateAsync({ type: 'blob' }).then(function (content) {
                        saveAs(content, 'program.zip');
                    });

                }}
            >Export
            </button>
            <Modal
                open={open}
                onBackdropClick={() => setOpen(false)}
            >
                <div className="w-3/4 h-3/4 bg-gray-200 p-20 ml-auto mr-auto mt-20">
                    <HTMLView/>
                </div>
            </Modal>
        </>
    )
}