import {FC, useContext, useEffect} from "react";
import ReactDOM from "react-dom";
import {runJs} from "../utils";
import {ConstraintContext} from "../App";

interface Props {
    HTML: string;
}

export const HTMLView: FC<Props> = ({HTML}) => {
    const {constraints, setConstraints} = useContext(ConstraintContext);

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
                runJs(constraints);
            });
    }, [HTML]);

    return (
        <div id="index"/>
    );
}