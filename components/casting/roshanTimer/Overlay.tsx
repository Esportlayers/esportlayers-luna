import { ReactElement, useState, useEffect } from "react";
import { useMessageListener } from "../../websocket/MessageHandler";
import { isOverlayMessage, isGsiPausedMessage, isGsiWinnerMessage, isGsiRoshanMessage } from "../../websocket/state";
import { useInterval } from "../../../hooks/interval";
import Timer from "./Timer";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";

const variants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
    }
}

export default function Overlay({testing, auth}: {testing: boolean; auth: string}): ReactElement | null {
    const message = useMessageListener();
    const [remaining, setRemaining] = useState(0);
    const [paused, setPaused] = useState(false);
    const [state, setState] = useState<'alive' | 'respawn_base' | 'respawn_variable' | 'aegis'>('alive');
    const [cacheKey, setCacheKey] = useState(dayjs().unix());

    useEffect(() => {
        if(message) {
            if(isGsiRoshanMessage(message)) {
                setRemaining(message.value.remaining);
                setState(message.value.state);
            }
            if (isGsiWinnerMessage(message) && message.value.winnerTeam !== 'none') {
                setRemaining(0);
                setState('alive');
            }
            if(isGsiPausedMessage(message)) {
                setPaused(message.value);
            }
            
            if(isOverlayMessage(message)) {
                setCacheKey(message.date);
            }
        }
    }, [message]);

    useInterval(() => !paused && remaining > 0 && setRemaining(remaining - 1));


    return <AnimatePresence>
        {((remaining > 0 || (state === 'respawn_base' && remaining === 0)) || testing) && <motion.div initial={'hidden'} animate={'visible'} exit={'hidden'} variants={variants}>
            <Timer remaining={remaining} state={state} auth={auth} key={cacheKey}/>
        </motion.div>}
    </AnimatePresence>;
    
}
