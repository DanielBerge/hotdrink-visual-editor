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

export enum EditorType {
    CODE = "CODE",
    VISUAL = "VISUAL",
}

export enum Binding {
    Value = "value",
    Disabled = "disabled",
    InnerText = "innertext",
}

export interface Elem {
    height: number;
    width: number;
    x: number;
    y: number;
    type: ElemType;
    subType?: undefined | InputType;
    binding: Binding;
    value: string;
    id: string;
}

export interface Constraint {
    fromId: string;
    toId: string;
    code: string;
    type: EditorType;
    rete?: Data;
}
