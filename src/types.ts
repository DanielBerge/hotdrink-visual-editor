export enum ElemType {
    Input = "input",
    Button = "button",
    Text = "text",
}

export enum InputType {
    Text = "text",
    Number = "number",
    Date = "date",
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

export interface VMethod {
    id: string;
    code: string;
    type: EditorType;
    toIds: string[];
    visualJson?: [components: any[], connections: any[]];
}

export interface Constraint {
    x: number;
    y: number;
    width: number;
    height: number;
    fromIds: string[];
    //toIds: string[];
    methods: VMethod[];
}

export interface Socket {
    id: string;
    variable: string;
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
    value?: any;
}

export interface Param {
    index: number;
    name: string;
    type: string;
}

export interface LibraryComponent {
    id: string;
    label: string;
    params?: Param[];
    inputs?: Socket[];
    outputs?: Socket[];

    code(inputConnections: Connection[], outputSockets: VComponent): string;
}
