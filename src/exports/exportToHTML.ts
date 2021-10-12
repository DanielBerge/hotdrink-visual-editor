import {Elem, ElemType} from "../types";


export function exportToHTML(elements: Elem[]) {
    let html = "<html>";

    for (const {type, x, y, value, subType, width, height} of elements) {
        switch (type) {
            case ElemType.Input:
                html += `<input 
                            type=${subType}
                            style="
                                 position:absolute;
                                 top:${y}px;
                                 left:${x}px;
                                 width:${width}px;
                                 height:${height}px;
                            "
                            />`;
                break;
            case ElemType.Button:
                html += `<button 
                            style="
                                 position:absolute;
                                 top:${y}px;
                                 left:${x}px;
                                 width:${width}px;
                                 height:${height}px;
                                 background-color:gray;"
                            "
                         >${value}</button>`;
                break;
        }
    }
    html += "</html>";
    return html;
}