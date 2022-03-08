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
                                 border-radius: 10px;
                                 border-style:solid;
                                 border-width:1px;
                                 border-color:black;
                            "
                            value="${value}"
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
                                 border-radius: 10px;
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
                case ElemType.Checkbox:
                    this.add(`<input 
                            id=${id}
                            type="checkbox"
                            style="
                                 position:absolute;
                                 top:${y + relativeY}px;
                                 left:${x + relativeX}px;
                                 width:${width}px;
                                 height:${height}px;
                            "
                            checked="${value}"
                            />`);
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
        this.add(`async function run() { `)
        this.add(`const system = hd.constraintSystemFromJson(${JSON.stringify(json)});`)
        this.add(`const comp = Array.from(system.allComponents())[0];`);

        this.add(`function bind(value, element, type) {
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
    }`);

        for (const constraint of constraints) {
            const unionIds = Array.from(new Set([...constraint.fromIds, ...constraint.methods.map((method) => method.toIds).flat()]));
            for (const id of unionIds) {
                const bindingType = elements.getElementById(id).binding;
                this.add(`await comp.vs["${id}"].currentPromise;`);
                this.add(`system.update();`);
                this.add(`bind(comp.vs["${id}"], document.getElementById("${id}"), "${bindingType}");`);
            }
            /**
             const fromBindingType = elements.getElementById(constraints[i].fromIds[0]).binding;
             const toBindingType = elements.getElementById(constraints[i].toIds[0]).binding;
             this.add(`bind(document.getElementById("${constraints[i].fromIds[0]}"), Array.from(system.variables())[${counter++}]._owner, ${fromBindingType});`)
             this.add(`bind(document.getElementById("${constraints[i].toIds[0]}"), Array.from(system.variables())[${counter++}]._owner, ${toBindingType});`)
             **/
        }

        this.add(`}`)
        this.add(`run();`);
        this.add("</script>")
        return this;
    }
}
