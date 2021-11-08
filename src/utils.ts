import {Component, ConstraintSpec, defaultConstraintSystem, maskNone, Method, VariableReference} from "hotdrink";
import {VComponent, Constraint, Elem} from "./types";

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

export function runJs(constraints: Constraint[], elements: any) {
    let index = 0;
    const freshIndex = () => ++index;
    try {
        for (const constraint of constraints) {
            let system = defaultConstraintSystem;

            const func = eval(`(${constraint.fromId}) => {
                ${constraint.code}
            }`)
            const method1 = new Method(2, [0], [1], [maskNone], func);

            const cspec = new ConstraintSpec([method1]);

            const comp = new Component(`Component${freshIndex()}`);
            const varA = comp.emplaceVariable(constraint.fromId, undefined);
            const varB = comp.emplaceVariable(constraint.toId, undefined);

            comp.emplaceConstraint(`C${freshIndex()}`, cspec, [varA, varB], false);

            system.addComponent(comp);

            try {
                const fromBindingType = elements.getElementById(constraint.fromId).binding;
                const toBindingType = elements.getElementById(constraint.toId).binding;
                DOMBind(document.getElementById(constraint.fromId), comp.vs[constraint.fromId], fromBindingType);
                DOMBind(document.getElementById(constraint.toId), comp.vs[constraint.toId], toBindingType);
            } catch (e) {
                console.log(e);
            }
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

export function getPoints(from: Elem, to: Elem) {
    let fromX = from.x;
    let fromY = from.y;
    let toX = to.x;
    let toY = to.y;
    let fromHeight = from.height;
    let toHeight = to.height;
    let fromWidth = from.width;
    let toWidth = to.width;
    const spaceFromEnd = 8;

    function calculatePlacement(side: number, from: number, to: number) {
        return side / 2 + Math.max(Math.min(side / 2, (from - to) / 2), -side / 2);
    }

    if (Math.abs(fromX - toX) > Math.abs(fromY - toY)) {
        if (fromX < toX) {
            toY += calculatePlacement(toHeight, fromY, toY);
            fromY += fromHeight / 2;
            fromX += fromWidth;
            toX -= spaceFromEnd;
        } else if (fromX > toX) {
            toY += calculatePlacement(toHeight, fromY, toY);
            fromY += fromHeight / 2;
            toX += toWidth;
            toX += spaceFromEnd;
        }
    } else {
        if (fromY < toY) {
            toX += calculatePlacement(toWidth, fromX, toX);
            fromX += fromWidth / 2;
            fromY += fromHeight;
            toY -= spaceFromEnd;
        } else if (fromY > toY) {
            toX += calculatePlacement(toWidth, fromX, toX);
            fromX += fromWidth / 2;
            toY += toHeight;
            toY += spaceFromEnd;
        }
    }

    return [fromX, fromY, toX, toY]
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

export function socketYAxisPlacement(component: VComponent, index: number) {
    return component.y + (component.height / ((component.outputs?.length ?? 1) * 2)) * index
}
