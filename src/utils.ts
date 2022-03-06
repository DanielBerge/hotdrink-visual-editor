import {
    Component,
    ConstraintSpec,
    constraintSystemToJson,
    defaultConstraintSystem,
    maskNone, maskUpdate,
    Method,
    VariableReference,
} from "hotdrink";
import {Constraint, VComponent, VMethod, Binding} from "./types";

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

export function runJs(constraints: Constraint[], elements: any): any {
    let index = 0;
    const freshIndex = () => ++index;
    try {
        for (const constraint of constraints) {

            const func = (method: VMethod) => eval(`(${constraint.fromIds.join(", ")}) => {
                ${method.code}
            }`)

            const unionIds = Array.from(new Set([...constraint.fromIds, ...constraint.methods.map((method) => method.toIds).flat()]));
            const methods = constraint.methods.map((method) => {
                return new Method(
                    unionIds.length,
                    constraint.fromIds.map((id) => unionIds.indexOf(id)),
                    method.toIds.map((id) => unionIds.indexOf(id)),
                    [...constraint.fromIds.map(() => maskNone)],
                    func(method));
            });

            const cspec = new ConstraintSpec(methods);
            const comp = new Component(`Component${freshIndex()}`);
            const vars = unionIds.map((id) => {
                return comp.emplaceVariable(id, elements.getElementById(id)?.value ?? "");
            })
            comp.emplaceConstraint(`C${freshIndex()}`, cspec, vars, false);
            defaultConstraintSystem.addComponent(comp);
            defaultConstraintSystem.update();
            try {
                for (const id of unionIds) {
                    const bindingType = elements.getElementById(id).binding;
                    DOMBind(document.getElementById(id), comp.vs[id], bindingType);
                }
            } catch (e) {
                console.error(e);
            }
        }
        console.log(constraintSystemToJson(defaultConstraintSystem))
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


export function clamp(num: number, max: number): number {
    if (num < 0) {
        return 0;
    }
    if (num > max) {
        return max;
    }
    return num;
}

export function socketYAxisPlacement(component: VComponent, index: number, length: number | undefined, includeY: boolean = false) {
    if (length) {
        if (length === 1) {
            return includeY ? component.y + component.height / 2 : component.height / 2;
        }
        return includeY ? component.y + (component.height / (length * 2)) * index : (component.height / (length * 2)) * index;
    }
    return 0;
}
