export enum ElemType {
    Input = "input",
    Button = "button",
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
}
