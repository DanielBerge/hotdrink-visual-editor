import React, {FC, useContext, useState} from "react";


const MessageContext = React.createContext<any>({});

export interface MessageProps {
    message: string;
    setMessage: (message: string) => void;
}


const MessageWrapper: FC = (props) => {
    const [message, setMessage] = useState<string>("");

    return (
        <MessageContext.Provider value={{message, setMessage}}>
            {props.children}
        </MessageContext.Provider>
    )
}

function useMessage(): MessageProps {
    const {message, setMessage} = useContext(MessageContext);

    return {
        message,
        setMessage,
    }
}

export {MessageWrapper, useMessage};
