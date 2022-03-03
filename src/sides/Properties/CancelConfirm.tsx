import {useConstraints} from "../../wrappers/ConstraintsWrapper";
import React, {FC} from "react";

interface Props {
    onCancel: () => void;
    onConfirm: () => void;
}

export const CancelConfirm: FC<Props> = ({onCancel, onConfirm}) => {
    const constraints = useConstraints();

    return <div>
        {constraints.newConstraint && <button
            className={`h-10 bg-red-600 text-white p-2 m-2`}
            onClick={onCancel}
        >
            Cancel
        </button>}
        {constraints.newConstraint && <button
            className={`h-10 bg-green-600 text-white p-2 m-2`}
            onClick={onConfirm}
        >
            Confirm
        </button>}
    </div>
}