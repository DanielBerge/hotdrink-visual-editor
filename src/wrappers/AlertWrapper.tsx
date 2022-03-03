import React, {FC, useContext, useState} from "react";


const AlertContext = React.createContext<any>({});

export interface AlertContextProps {
    message: string;
    error: string;
    setMessage: (message: string) => void;
    setError: (error: string) => void;
    clearMessages: () => void;
}


const AlertWrapper: FC = (props) => {
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<string>("");

    function clearMessages() {
        setMessage("");
        setError("");
    }

    return (
        <AlertContext.Provider value={{message, setMessage, error, setError, clearMessages}}>
            {props.children}
        </AlertContext.Provider>
    )
}

function useAlert(): AlertContextProps{
    const {message, setMessage, error, setError, clearMessages} = useContext(AlertContext);

    return {
        message,
        setMessage,
        error,
        setError,
        clearMessages,
    }
}

export {AlertWrapper, useAlert};
