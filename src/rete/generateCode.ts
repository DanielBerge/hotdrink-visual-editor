import {Engine} from "rete";
import {Data} from "rete/types/core/data";

export async function generateCode(engine: Engine, data: Data): Promise<string> {
    let file = '';

    engine = engine.clone();

    Array.from(engine.components.values()).forEach((component) => {
        component = Object.assign(Object.create(Object.getPrototypeOf(component)), component)

        component.worker = (node, inputs, outputs) => {
            function add(name: string, expression: any) {
                if (!expression) {
                    file += `${name};\n`;
                    return;
                }

                const varName = `${name}`;

                file += `const ${varName} = ${expression};\n`;
                outputs[name] = varName;
            }
            // @ts-ignore
            component.code(node, inputs, add);
        }
        component.worker.bind(component);

        engine.components.set(component.name, component);
    })

    await engine.process(data);

    return file;
}