import {Data} from "rete/types/core/data";

export enum ElemType {
    Input = "input",
    Button = "button",
    Text = "text",
}

export enum InputType {
    Text = "text",
    Number = "number",
}

export interface Elem {
    height: number;
    width: number;
    x: number;
    y: number;
    type: ElemType;
    subType?: undefined | InputType;
    value: string;
    id: string;
}

export interface Constraint {
    fromId: string;
    toId: string;
    code: string;
    rete?: Data;
}
