import {
    component,
    Component,
    ConstraintSpec,
    defaultConstraintSystem,
    maskNone,
    Method,
    VariableReference
} from "hotdrink";
import {Constraint} from "./types";

export const idToValue = new Map();
export const valueToId = new Map();

export function DOMBind(element: HTMLElement | null, value: VariableReference<any> | undefined, attribute: string) {
    if (element === null) {
        throw Error("DOM Element is null");
    }
    let unsubscribeHD = value?.value?.subscribe({
        next: (val: any) => {
            if (val.hasOwnProperty("value")) {
                // @ts-ignore
                element[attribute] = val.value;
            }
        }
    });

    function setHDValue() {
        // @ts-ignore
        value?.value?.set(element[attribute]);
    }

    element?.addEventListener('input', setHDValue);
    idToValue.set(element?.id, value);
    valueToId.set(value, element?.id);

    function unsubscribe() {
        idToValue.delete(element?.id);
        valueToId.delete(value);
        element?.removeEventListener('input', setHDValue);
        unsubscribeHD?.unsubscribe();
    }

    return unsubscribe;
}

export function runJs(constraints: Constraint[]) {
    try {
        let system = defaultConstraintSystem;

        /**
        const method1 = new Method(2, [0], [1], [maskNone], (initial: number) => {
            const positive = initial >= 0;
            return positive;
        });

        const cspec = new ConstraintSpec([method1]);

        const comp = new Component("Component");
        const varA = comp.emplaceVariable(constraints[0].fromId, undefined);
        const varB = comp.emplaceVariable(constraints[0].toId, undefined);

        comp.emplaceConstraint("C", cspec, [varA, varB], false);

        system.addComponent(comp);
         **/

        let comp = component`
               var initial, initial2;
               
               constraint {
                    (initial -> initial2) => {
                             const positive = initial >= 0;
                             return positive;
                    }
               }
        `

        system.addComponent(comp);

        DOMBind(document.getElementById(constraints[0].fromId), comp.vs.initial, "value");
        DOMBind(document.getElementById(constraints[0].toId), comp.vs.initial2, "value");

    } catch (e) {
        console.error(e);
    }
}
