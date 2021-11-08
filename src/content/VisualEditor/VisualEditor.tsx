import {Layer, Stage} from "react-konva"
import {VisualComponent} from "./VisualComponent";
import {useVisual} from "./VisualWrapper";


export const VisualEditor = () => {
    const visual = useVisual();

    return (
        <div>
            <Stage
                width={window.innerWidth}
                height={500}
                className="bg-gray-100"
            >
                <Layer>
                    {visual.components.map((component) => {
                        return <VisualComponent key={component.id} component={component} updateComponent={visual.updateComponent}/>
                    })}
                </Layer>
            </Stage>
        </div>
    )
}