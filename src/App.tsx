import React from 'react';
import {Canvas} from './content/Canvas/Canvas';
import {Column} from "./sides/Column";
import {Components} from "./sides/Components";
import {Properties} from "./sides/Properties/Properties";
import {Constraints} from "./sides/Constraints";
import {ElementsWrapper} from "./wrappers/ElementsWrapper";
import {ConstraintsWrapper} from "./wrappers/ConstraintsWrapper";
import {EditorWrapper} from "./wrappers/EditorWrapper";
import {AlertWrapper} from "./wrappers/AlertWrapper";
import {AlertBox} from "./content/AlertBox";
import {RoundBox} from "./sides/RoundBox";
import {ConstraintProperties} from "./sides/Properties/ConstraintProperties";
import {ComponentProperties} from "./sides/Properties/ComponentProperties";

let id = 0;

export function freshId() {
    return ++id;
}


function App() {
    return (
        <AlertWrapper>
            <ElementsWrapper>
                <ConstraintsWrapper>
                    <div className="flex space-x-3 max-h-full">
                        <AlertBox/>
                        <Column>
                            <RoundBox>
                                <Components/>
                            </RoundBox>
                            <ComponentProperties/>
                        </Column>
                        <div className="flex-1">
                            <EditorWrapper>
                                <Canvas/>
                            </EditorWrapper>
                        </div>
                        <Column>
                            <RoundBox>
                                <Constraints/>
                            </RoundBox>
                            <ConstraintProperties/>
                            <div className={"absolute bottom-10"}>
                                <RoundBox>
                                    <Properties/>
                                </RoundBox>
                            </div>
                        </Column>
                    </div>
                </ConstraintsWrapper>
            </ElementsWrapper>
        </AlertWrapper>
    );
}

export default App;
