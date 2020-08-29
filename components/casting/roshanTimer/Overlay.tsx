import { ReactElement, useState, useEffect } from "react";
import { useMessageListener } from "../../websocket/MessageHandler";
import { isRoshanMessage, isWinnerMessage, isPauseMessage, isOverlayMessage } from "../../websocket/state";
import { useInterval } from "../../../hooks/interval";
import Timer from "./Timer";
import dayjs from "dayjs";

export default function Overlay({testing, auth}: {testing: boolean; auth: string}): ReactElement | null {
    const message = useMessageListener();
    const [remaining, setRemaining] = useState(0);
    const [paused, setPaused] = useState(false);
    const [state, setState] = useState<'alive' | 'respawn_base' | 'respawn_variable' | 'aegis'>('alive');
    const [cacheKey, setCacheKey] = useState(dayjs().unix());

    useEffect(() => {
        if(message) {
            if(isRoshanMessage(message)) {
                setRemaining(message.value.remaining);
                setState(message.value.state);
            }
            if (isWinnerMessage(message)) {
                setRemaining(0);
                setState('alive');
            }
            if(isPauseMessage(message)) {
                setPaused(message.value);
            }
            
            if(isOverlayMessage(message)) {
                setCacheKey(message.date);
            }
        }
    }, [message]);

    useInterval(() => !paused && remaining > 0 && setRemaining(remaining - 1));

    if((remaining > 0 || (state === 'respawn_base' && remaining === 0)) || testing) {
        return <Timer remaining={remaining} state={state} auth={auth} key={cacheKey}/>;
    }
    return null;
}
