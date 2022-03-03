import React from 'react';
import {Canvas} from './content/Canvas/Canvas';
import {Column} from "./sides/Column";
import {Components} from "./sides/Components";
import {Properties} from "./sides/Properties/Properties";
import {Constraints} from "./sides/Constraints";
import {ElementsWrapper} from "./wrappers/ElementsWrapper";
import {ConstraintsWrapper} from "./wrappers/ConstraintsWrapper";
import {EditorWrapper} from "./wrappers/EditorWrapper";
import {MessageWrapper} from "./wrappers/MessageWrapper";
import {MessageBox} from "./content/MessageBox";

let id = 0;

export function freshId() {
    return ++id;
}


function App() {
    return (
        <MessageWrapper>
            <ElementsWrapper>
                <ConstraintsWrapper>
                    <div className="flex space-x-3 h-screen">
                        <MessageBox/>
                        <Column>
                            <Components/>
                            <Constraints/>
                        </Column>
                        <div className="flex-1">
                            <EditorWrapper>
                                <Canvas/>
                            </EditorWrapper>
                        </div>
                        <Column>
                            <Properties/>
                        </Column>
                    </div>
                </ConstraintsWrapper>
            </ElementsWrapper>
        </MessageWrapper>
    );
}

export default App;
