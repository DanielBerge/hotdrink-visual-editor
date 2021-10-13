import {FC, useEffect} from "react";
import ReactDOM from "react-dom";
import {runJs} from "../utils";
import {useConstraints} from "../wrappers/ConstraintsWrapper";

interface Props {
    HTML: string;
}

export const HTMLView: FC<Props> = ({HTML}) => {
    const constraints = useConstraints();

    useEffect(() => {
        function createMarkup(string: string) {
            return {__html: string};
        }

        ReactDOM.render(<div
                id="content"
                style={{height: "100%", width: "100%"}}
                dangerouslySetInnerHTML={createMarkup(HTML)}
            />,
            document.getElementById("index"), () => {
                runJs(constraints.constraints);
            });
    }, [HTML]);

    return (
        <div id="index"/>
    );
}