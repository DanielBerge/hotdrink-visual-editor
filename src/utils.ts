import {Component, ConstraintSpec, defaultConstraintSystem, maskNone, Method, VariableReference} from "hotdrink";
import {Constraint} from "./types";

export const idToValue = new Map();
export const valueToId = new Map();

/**

 Binds a DOM element to a variable.

 This function binds a DOM element to a variable. When
 the variable changes, the DOM element's attribute is updated
 and vise versa.

 Parameters
 ----------
 @param element : HTMLElement
 The DOM element to bind to.
 @param value : VariableReference
 The variable to bind to.
 @param attribute : string
 The name of the attribute to bind to.

 Returns
 -------
 unsubscribe : function
 A function that will unbind the DOM element from the variable.

 */
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

/**
 * Converts the first character of a string to upper case.
 *
 * @param string - The string to convert.
 *
 * @returns The converted string.
 */
export function upperCaseFirst(string: string): string {
    return string.slice(0, 1).toUpperCase() + string.slice(1);
}

/**
 * Converts the first character of a string to lower case.
 *
 * @param string - The string to convert.
 *
 * @returns The converted string.
 */
export function lowerCaseFirst(string: string): string {
    return string.slice(0, 1).toLowerCase() + string.slice(1);
}
