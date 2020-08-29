import React, { ReactElement, useState, useEffect } from "react";
import { useBetStateValue } from "../Context";
import Overlay from "./Overlay";
import { useMessageListener } from "../../websocket/MessageHandler";
import dayjs from "dayjs";
import { isOverlayMessage } from "../../websocket/state";

interface Props {
    auth: string;
}

export default React.memo(function Frame({auth}: Props): ReactElement | null {
    const [{betRound}] = useBetStateValue();
    const message = useMessageListener();
    const [cacheKey, setCacheKey] = useState(dayjs().unix());

    useEffect(() => {
        if(message) {
            if(isOverlayMessage(message)) {
                setCacheKey(message.date);
            }
        }
    }, [message])

    if(betRound && betRound.betSeason !== 0) {
        return <Overlay season={betRound.betSeason} auth={auth} key={cacheKey}/>;
    }
    return null;
});