import { ReactElement, useState, useEffect } from "react";
import Timer from "./Timer";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import { EventTypes, GsiGameStateMessage, GsiGameWinnerMessage, GsiRoshanMessage, OverlayMessage, useTetherMessageListener } from "@esportlayers/io";
import { GameState } from "@esportlayers/morphling";

const variants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
    }
}

export default function Overlay({testing, auth}: {testing: boolean; auth: string}): ReactElement | null {
    const [remaining, setRemaining] = useState(0);
    const [state, setState] = useState<'alive' | 'respawn_base' | 'respawn_variable' | 'aegis'>('alive');
    const [cacheKey, setCacheKey] = useState(dayjs().unix());


    const {value: roshanMessage} = useTetherMessageListener<GsiRoshanMessage>(EventTypes.gsi_roshan) || {value: null};
    const {value: winnerMessageValue} = useTetherMessageListener<GsiGameWinnerMessage>(EventTypes.gsi_game_winner) || {value: null};
    const {value: gameStateMessageValue} = useTetherMessageListener<GsiGameStateMessage>(EventTypes.gsi_game_state) || {value: null};
    const {date: lastOverlayMessage} = useTetherMessageListener<OverlayMessage>(EventTypes.overlay) || {date: null};
    
    useEffect(() => {
        if(roshanMessage) {
            setRemaining(roshanMessage.respawnTime);
            setState(roshanMessage.state);
        } else  {
            setRemaining(0);
            setState('alive');
        }
    }, [roshanMessage]);

    useEffect(() => {
        if(winnerMessageValue?.winnerTeam !== 'none' || gameStateMessageValue === GameState.postGame) {
            setRemaining(0);
            setState('alive');
        }
    })

    useEffect(() => setCacheKey(lastOverlayMessage), [lastOverlayMessage]);

    return <AnimatePresence>
        {((remaining > 0 || (state === 'respawn_base' && remaining === 0)) || testing) && <motion.div initial={'hidden'} animate={'visible'} exit={'hidden'} variants={variants}>
            <Timer remaining={remaining} state={state} auth={auth} key={cacheKey}/>
        </motion.div>}
    </AnimatePresence>;
    
}
