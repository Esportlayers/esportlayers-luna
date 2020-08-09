import { ReactElement, useEffect, useState } from 'react';
import Websocket from 'react-websocket';
import { useStateValue } from './context';
import { newMessage, Message } from "./state";

export default function MessageHandler({url}: {url: string}): ReactElement {
    const [, dispatch] = useStateValue();

    const onMessage = (msg) => {
        try {
            const {type, ...props} = JSON.parse(msg);
            dispatch(newMessage({...props, type}))
        } catch(Error) {
            console.error('Invalid websocket message', msg);
        }
    };
    return <Websocket url={url} onMessage={onMessage}/>;
}

export function useMessageListener(): Message | null {
    const [{messages}] = useStateValue();
    const [msg, setMsg] = useState<Message | null>(messages.length > 0 ? messages.slice(-1)[0] : null);

    useEffect(() => {
        const lastMessage = messages.slice(-1);
        const message = lastMessage.length > 0 ? lastMessage[0] : null;
        setMsg(message);
    }, [messages]);
    
    return msg;
}
