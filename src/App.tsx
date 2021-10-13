import React, {useState} from 'react';
import {Canvas} from './content/Canvas';
import {Column} from "./sides/Column";
import {Components} from "./sides/Components";
import {Properties} from "./sides/Properties";
import {Constraints} from "./sides/Constraints";
import {ElementsWrapper} from "./wrappers/ElementsWrapper";
import {ConstraintsWrapper} from "./wrappers/ConstraintsWrapper";

let id = 0;

export function freshId() {
    return ++id;
}


function App() {
    return (
        <ElementsWrapper>
            <ConstraintsWrapper>
                        <div className="flex space-x-3 h-screen">
                            <Column>
                                <Components/>
                                <Constraints/>
                            </Column>
                            <div className="flex-1">
                                <Canvas/>
                            </div>
                            <Column>
                                <Properties/>
                            </Column>
                        </div>
            </ConstraintsWrapper>
        </ElementsWrapper>
    );
}

export default App;
