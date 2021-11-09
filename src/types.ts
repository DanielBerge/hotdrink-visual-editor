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
    visual?: string;
}

export interface Socket {
    id: string;
    variable: string;
    label: string;
}

export interface Connection {
    fromComponentId?: string;
    toComponentId?: string;
    fromSocketIndex?: number;
    toSocketIndex?: number;
    toSocket?: Socket;
    fromSocket?: Socket;
}

export interface VComponent extends LibraryComponent {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface LibraryComponent {
    id: string;
    label: string;
    inputs?: Socket[];
    outputs?: Socket[];

    code(inputConnections: Connection[], outputSockets: Socket[]): string;
}
