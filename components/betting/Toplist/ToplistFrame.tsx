import React, { ReactElement, useState, useEffect } from "react";
import Overlay from "./Overlay";
import { useMessageListener } from "../../websocket/MessageHandler";
import dayjs from "dayjs";
import { isOverlayMessage, isGsiGameStateMessage } from "../../websocket/state";
import { useAbortFetch } from "../../../hooks/abortFetch";
import { fetchUser } from "../../dotaStats/Overlay";

interface Props {
    auth: string;
    testing: boolean;
}

export default function Frame({auth, testing}: Props): ReactElement | null {
    const [user] = useAbortFetch(fetchUser, auth);
    const message = useMessageListener();
    const [cacheKey, setCacheKey] = useState(dayjs().unix());

    useEffect(() => {
        if(message) {
            if(isOverlayMessage(message) || isGsiGameStateMessage(message)) {
                setCacheKey(message.date);
            }
        }
    }, [message])

    if(user) {
        return <Overlay season={user.betSeasonId} auth={auth} key={cacheKey} testing={testing}/>;
    }

    return null;
}