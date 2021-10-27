import {FC, useEffect} from "react";
import ReactDOM from "react-dom";
import {runJs} from "../utils";
import {useConstraints} from "../wrappers/ConstraintsWrapper";
import {useElements} from "../wrappers/ElementsWrapper";
import {HTMLBuilder} from "../exports/HTMLBuilder";

export const HTMLView: FC = () => {
    const constraints = useConstraints();
    const elements = useElements()

    useEffect(() => {
       let builder = new HTMLBuilder();
       builder.includeHTML(elements.elements).end();

        function createMarkup(string: string) {
            return {__html: string};
        }

        ReactDOM.render(<div
                id="content"
                style={{height: "100%", width: "100%"}}
                dangerouslySetInnerHTML={createMarkup(builder.build())}
            />,
            document.getElementById("index"), () => {
                runJs(constraints.constraints);
            });
    }, [constraints.constraints]);

    return (
        <div id="index"/>
    );
}