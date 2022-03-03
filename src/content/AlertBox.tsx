import React from "react";
import {useAlert} from "../wrappers/AlertWrapper";


export const AlertBox = () => {
    const alert = useAlert();

    return <>
        <div style={{
            position: 'absolute',
            top: 0,
            left: "30%",
            color: 'black',
            fontSize: '20px',
            fontWeight: 'bold',
            zIndex: 100,
        }}>
            {alert.message}
        </div>
        <div style={{
            position: 'absolute',
            top: "30px",
            left: "30%",
            color: 'red',
            fontSize: '18px',
            fontWeight: 'bold',
            zIndex: 100,
        }}>
            {alert.error}
        </div>
    </>
}