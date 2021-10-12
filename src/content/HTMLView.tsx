import {FC, useEffect} from "react";
import ReactDOM from "react-dom";

interface Props {
    HTML: string;
}

export const HTMLView: FC<Props> = ({HTML}) => {

    useEffect(() => {
        function createMarkup(string: string) {
            return {__html: string};
        }

        ReactDOM.render(<div
                id="content"
                style={{height: "100%", width: "100%"}}
                dangerouslySetInnerHTML={createMarkup(HTML)}
            />,
            document.getElementById("index"));
    }, [HTML]);

    return (
        <div id="index"/>
    );
}