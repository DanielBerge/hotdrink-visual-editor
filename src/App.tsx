import React from 'react';
import {Canvas} from './content/Canvas/Canvas';
import {Column} from "./sides/Column";
import {Elements} from "./sides/Elements";
import {Actions} from "./sides/Properties/Actions";
import {Constraints} from "./sides/Constraints";
import {ElementsWrapper} from "./wrappers/ElementsWrapper";
import {ConstraintsWrapper} from "./wrappers/ConstraintsWrapper";
import {EditorWrapper} from "./wrappers/EditorWrapper";
import {AlertWrapper} from "./wrappers/AlertWrapper";
import {AlertBox} from "./content/AlertBox";
import {RoundBox} from "./sides/RoundBox";
import {ConstraintProperties} from "./sides/Properties/ConstraintProperties";
import {ElementProperties} from "./sides/Properties/ElementProperties";
import {MethodProperties} from "./sides/Properties/MethodProperties";

let id = 0;

export function freshId() {
    return ++id;
}


function App() {
    return (
        <AlertWrapper>
            <ElementsWrapper>
                <ConstraintsWrapper>
                    <EditorWrapper>
                        <div className="flex space-x-3 max-h-full">
                            <AlertBox/>
                            <Column>
                                <RoundBox>
                                    <Elements/>
                                </RoundBox>
                                <ElementProperties/>
                            </Column>
                            <div className="flex-1">
                                <Canvas/>
                            </div>
                            <Column>
                                <RoundBox>
                                    <Constraints/>
                                </RoundBox>
                                <ConstraintProperties/>
                                <MethodProperties/>
                                <div className={"absolute bottom-10"}>
                                    <RoundBox>
                                        <Actions/>
                                    </RoundBox>
                                </div>
                            </Column>
                        </div>
                    </EditorWrapper>
                </ConstraintsWrapper>
            </ElementsWrapper>
        </AlertWrapper>
    );
}

export default App;
