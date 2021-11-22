import {Connection, LibraryComponent, Socket, VComponent} from "./types";

export class LibraryComponentBuilder {
    id: string;
    label: string;
    code: (inputConnections: Connection[], outputSockets: VComponent) => string;
    inputField: string;
    inputs: Socket[];
    outputs: Socket[];

    constructor(id: string, label: string) {
        this.id = id;
        this.label = label;
        this.code = () => "";
        this.inputField = "";
        this.inputs = [];
        this.outputs = [];
    }

    addInput(socket: Socket) {
        this.inputs.push(socket);
    }

    addOutput(socket: Socket) {
        this.outputs.push(socket);
    }

    setInputField(inputField: string) {
        this.inputField = inputField;
    }

    operatorCode(operator: string) {
        this.code = (inputConnections: Connection[], component: VComponent) => {
            if (inputConnections.length === 1 && component.outputs?.length === 1) {
                return `const ${component.outputs[0].variable} = ${inputConnections[0].fromSocket?.variable ?? ""} ${operator} ${component.value};\n`;
            }
            if (inputConnections.length === 2 && component.outputs?.length === 1) {
                return `const ${component.outputs[0].variable} = ${inputConnections[0].fromSocket?.variable ?? ""} ${operator} ${inputConnections[1].fromSocket?.variable ?? ""};\n`;
            }
            return "";
        }
    }

    build(): LibraryComponent {
        return {
            id: this.id,
            label: this.label,
            inputs: this.inputs,
            outputs: this.outputs,
            inputField: this.label,
            code: this.code
        };
    }

}