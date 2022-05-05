import {useState} from "react";
import {Modal} from "@mui/material";
import {HTMLView} from "../../content/HTMLView";
import {useElements} from "../../wrappers/ElementsWrapper";
import {HTMLBuilder} from "../../exports/HTMLBuilder";
import {useConstraints} from "../../wrappers/ConstraintsWrapper";
import JSZip from "jszip";
import {saveAs} from 'file-saver';


export const Actions = () => {
    const elements = useElements();
    const constraints = useConstraints();
    const [open, setOpen] = useState(false);

    async function exportToZip() {
        const zip = new JSZip();
        let builder = new HTMLBuilder();
        builder.includeHTML(elements.elements).includeJS(constraints.constraints, elements).end();
        zip.file("index.html", builder.build());

        let response = await fetch("/hd-visual2/hotdrink.js", {
            method: "GET"
        });
        zip.file("hotdrink.js", await response.text())

        zip.generateAsync({type: 'blob'}).then(function (content) {
            saveAs(content, 'program.zip');
        });

    }

    return (
        <>
            <h1 className={"font-bold text-lg"}>Actions</h1>
            <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded m-1"
                onClick={() => setOpen(true)}
            >Run
            </button>
            <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded m-1"
                onClick={exportToZip}
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