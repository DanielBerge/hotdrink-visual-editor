import React from 'react';
import './App.css';
import {Canvas} from './Canvas';

export enum ElemType {
    Input = "input",
    Button = "button",
}

export interface Elem {
    height: number;
    width: number;
    x: number;
    y: number;
    type: ElemType;
    value: string;
    id: string;
}

function App() {
    const elements: Elem[] = [
        {
            height: 100,
            width: 200,
            x: 100,
            y: 100,
            type: ElemType.Input,
            value: "value",
            id: "id",
        },
        {
            height: 50,
            width: 150,
            x: 200,
            y: 200,
            type: ElemType.Button,
            value: "value2",
            id: "id2",
        }
    ]
    const json = JSON.stringify(elements);

    const fromJson: Elem[] = JSON.parse(json);

    console.log(fromJson);

    return (
        <div className="App">
            <Canvas elements={fromJson}/>
        </div>
    );
}

export default App;
