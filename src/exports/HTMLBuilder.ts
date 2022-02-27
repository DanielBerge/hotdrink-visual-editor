import {Constraint, Elem, ElemType} from "../types";
import {runJs} from "../utils";
import {constraintSystemToJson, defaultConstraintSystem} from "hotdrink";

export class HTMLBuilder {
    private html: string = "";

    constructor() {
        this.add("<html>");
    }

    add(str: string) {
        this.html += str;
        return this;
    }

    end() {
        this.add("</html>");
        return this;
    }

    build() {
        return this.html;
    }

    includeHTML(elements: Elem[], relativeX: number = 0, relativeY: number = 0) {
        for (const {type, x, y, value, subType, width, height, id} of elements) {
            switch (type) {
                case ElemType.Input:
                    this.add(`<input 
                            id=${id}
                            type=${subType}
                            style="
                                 position:absolute;
                                 top:${y + relativeY}px;
                                 left:${x + relativeX}px;
                                 width:${width}px;
                                 height:${height}px;
                            "
                            />`);
                    break;
                case ElemType.Button:
                    this.add(`<button 
                            id=${id}
                            style="
                                 position:absolute;
                                 top:${y + relativeY}px;
                                 left:${x + relativeX}px;
                                 width:${width}px;
                                 height:${height}px;
                                 background-color:black;
                                 color: white;
                            "
                         >${value}</button>`);
                    break;
                case ElemType.Text:
                    this.add(`<p
                            id=${id}
                            style="
                                 position:absolute;
                                 top:${y + relativeY}px;
                                 left:${x + relativeX}px;
                                 width:${width}px;
                                 height:${height}px;
                            "
                         >${value}</p>`);
                    break;
            }
        }
        return this;
    }

    private includeHotDrink() {
        this.add("<script type=\"text/javascript\" src=\"hotdrink.js\"></script>");
    }

    includeJS(constraints: Constraint[], elements: any) {
        this.includeHotDrink();
        runJs(constraints, elements);

        const json = constraintSystemToJson(defaultConstraintSystem);

        this.add("<script>");
        this.add(`const system = hd.constraintSystemFromJson(${JSON.stringify(json)});`)
        this.add(`function bind(element, value, type) {
    value.value.subscribe({
        next: val => {
            if (val.hasOwnProperty('value')) {
                element[type] = val.value;
            }
        }
    });
    element.addEventListener('input', () => {
        value.value.set(element[type]);
    });
}
`);
        let counter = 0;
        //FIXME Convert to multiple fromIds and toIds
        for (let i = 0; i < constraints.length; i++) {
            /**
            const fromBindingType = elements.getElementById(constraints[i].fromIds[0]).binding;
            const toBindingType = elements.getElementById(constraints[i].toIds[0]).binding;
            this.add(`bind(document.getElementById("${constraints[i].fromIds[0]}"), Array.from(system.variables())[${counter++}]._owner, ${fromBindingType});`)
            this.add(`bind(document.getElementById("${constraints[i].toIds[0]}"), Array.from(system.variables())[${counter++}]._owner, ${toBindingType});`)
             **/
        }

        this.add("</script>")
        return this;
    }
}
