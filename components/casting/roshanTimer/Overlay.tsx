import { ReactElement, useState, useEffect } from "react";
import { useMessageListener } from "../../websocket/MessageHandler";
import { isOverlayMessage, isGsiWinnerMessage, isGsiRoshanMessage } from "../../websocket/state";
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
    const [state, setState] = useState<'alive' | 'respawn_base' | 'respawn_variable' | 'aegis'>('alive');
    const [cacheKey, setCacheKey] = useState(dayjs().unix());

    useEffect(() => {
        if(message) {
            if(isGsiRoshanMessage(message)) {
                if(message.value) {
                    setRemaining(message.value.respawnTime);
                    setState(message.value.state);
                } else  {
                    setRemaining(0);
                    setState('alive');
                }
            }

            if (isGsiWinnerMessage(message) && message?.value?.winnerTeam !== 'none') {
                setRemaining(0);
                setState('alive');
            }

            if(isOverlayMessage(message)) {
                setCacheKey(message.date);
            }
        }
    }, [message]);

    return <AnimatePresence>
        {((remaining > 0 || (state === 'respawn_base' && remaining === 0)) || testing) && <motion.div initial={'hidden'} animate={'visible'} exit={'hidden'} variants={variants}>
            <Timer remaining={remaining} state={state} auth={auth} key={cacheKey}/>
        </motion.div>}
    </AnimatePresence>;
    
}
