import {FC} from "react";

export const RoundBox: FC = (props) => {
    return (
        <div className={"bg-white py-5 px-5 rounded mb-5 shadow"}>
            {props.children}
        </div>
    );
};