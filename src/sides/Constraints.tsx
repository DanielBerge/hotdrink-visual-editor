import React, {FC} from "react";

export const Constraints: FC = () => {

    function onCreate() {

    }

    return (
        <>
            <h1>Constraints</h1>
            <button
                className="h-10 bg-red-800 text-white p-2"
                onClick={onCreate}
            >Create constraint
            </button>
        </>
    )
}