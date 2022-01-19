import {useState} from "react";
import {Modal} from "@mui/material";
import {HTMLView} from "../../content/HTMLView";
import {useElements} from "../../wrappers/ElementsWrapper";
import {HTMLBuilder} from "../../exports/HTMLBuilder";
import {useConstraints} from "../../wrappers/ConstraintsWrapper";
import JSZip from "jszip";
import {saveAs} from 'file-saver';
import {ComponentProperties} from "./Components/ComponentProperties";
import {ConstraintProperties} from "./Constraints/ConstraintProperties";


export const Properties = () => {
    const elements = useElements();
    const constraints = useConstraints();
    const [open, setOpen] = useState(false);

    return (
        <>
            <h1 className={"font-bold text-lg"}>Properties</h1>
            <button
                className="h-10 bg-red-800 text-white p-2 disabled:opacity-50 m-1"
                onClick={() => setOpen(true)}
            >Run
            </button>
            <button
                className="h-10 bg-red-800 text-white p-2 disabled:opacity-50 m-1"
                onClick={async () => {
                    const zip = new JSZip();
                    let builder = new HTMLBuilder();
                    builder.includeHTML(elements.elements).includeJS(constraints.constraints, elements).end();
                    zip.file("index.html", builder.build());

                    let response = await fetch("/hotdrink.js", {
                        method: "GET"
                    });
                    zip.file("hotdrink.js", await response.text())

                    zip.generateAsync({type: 'blob'}).then(function (content) {
                        saveAs(content, 'program.zip');
                    });

                }}
            >Export
            </button>
            <ComponentProperties/>
            {elements.current && (
                <button
                    className="h-10 bg-red-800 text-white p-2 disabled:opacity-50 m-1"
                    onClick={() => {
                        elements.deleteElement(elements.current.id);
                        constraints.deleteConstraintsConnected(elements.current.id);
                        elements.setCurrent(undefined);
                    }}
                >Delete component
                </button>
            )}
            <ConstraintProperties/>
            {constraints.current && (
                <button
                    className="h-10 bg-red-800 text-white p-2 disabled:opacity-50 m-1"
                    onClick={() => {
                        constraints.deleteConstraint(constraints.current);
                        constraints.setCurrent(undefined);
                    }}
                >Delete constraint
                </button>
            )}
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