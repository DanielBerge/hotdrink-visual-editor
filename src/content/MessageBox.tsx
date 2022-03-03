import React from "react";
import {useMessage} from "../wrappers/MessageWrapper";


export const MessageBox = () => {
    const message = useMessage();

    return <div style={{
        position: 'absolute',
        top: 0,
        left: "30%",
        color: 'black',
        fontSize: '20px',
        fontWeight: 'bold',
        zIndex: 100,
    }}>
        {message.message}
    </div>
}