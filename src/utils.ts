import {Component, ConstraintSpec, defaultConstraintSystem, maskNone, Method, VariableReference} from "hotdrink";
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
        for (const constraint of constraints) {
            let system = defaultConstraintSystem;

            //const func = eval("(initial) => {const positive = initial >= 0; \nreturn positive;}")
            const func = eval(`(${constraint.fromId}) => {
                ${constraint.code}
            }`)
            const method1 = new Method(2, [0], [1], [maskNone], func);

            const cspec = new ConstraintSpec([method1]);

            const comp = new Component("Component");
            const varA = comp.emplaceVariable(constraint.fromId, undefined);
            const varB = comp.emplaceVariable(constraint.toId, undefined);

            comp.emplaceConstraint("C", cspec, [varA, varB], false);

            system.addComponent(comp);

            DOMBind(document.getElementById(constraint.fromId), comp.vs[constraint.fromId], "value");
            DOMBind(document.getElementById(constraint.toId), comp.vs[constraint.toId], "value");
        }
    } catch (e) {
        console.error(e);
    }
}
