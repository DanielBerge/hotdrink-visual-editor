import React, {FC} from "react";

export const Column: FC = (props) => {
    return (
        <div className="flex-2 p-8 bg-gray-100">
            {props.children}
        </div>
    )
}
