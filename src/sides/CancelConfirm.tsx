import React, {FC} from "react";

interface Props {
    onCancel: () => void;
    onConfirm: () => void;
}

export const CancelConfirm: FC<Props> = ({onCancel, onConfirm}) => {
    return <div>
        <button
            className={`h-10 bg-red-600 text-white p-2 m-2 rounded`}
            onClick={onCancel}
        >
            Cancel
        </button>
        <button
            className={`h-10 bg-green-600 text-white p-2 m-2 rounded`}
            onClick={onConfirm}
        >
            Confirm
        </button>
    </div>
}