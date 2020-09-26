import React, { ReactElement, useState, useEffect, useMemo } from "react";
import { DotaStats as DotaStatsEntitiy, User } from "@streamdota/shared-types";
import { useMessageListener } from "../websocket/MessageHandler";
import { get } from "../../modules/Network";
import { useAbortFetch } from "../../hooks/abortFetch";
import { GameState, isOverlayMessage, isGsiConnectedMessage, isGsiGameStateMessage, isGsiGameDataMessage } from "../websocket/state";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import OverlayImage from "./OverlayImage";


export async function fetchStats(abortController: AbortController, apiKey: string): Promise<DotaStatsEntitiy[]> {
    return (await get<DotaStatsEntitiy[]>('/user/dotaStats?frameApiKey=' + apiKey, 'json', {signal: abortController.signal}));
}

export async function fetchUser(abortController: AbortController, apiKey: string): Promise<User> {
    return (await get<User>('/user/baseData?frameApiKey=' + apiKey, 'json', {signal: abortController.signal}));
}

const visibleGameStates = new Set([
    GameState.DOTA_GAMERULES_STATE_GAME_IN_PROGRESS,
    GameState.DOTA_GAMERULES_STATE_PRE_GAME,
]);

const variants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
    }
}

export default function Overlay({frameKey, testing}: {frameKey: string; testing: boolean;}): ReactElement | null {
    const message = useMessageListener();
    const [cacheKey, setCacheKey] = useState(dayjs().unix());
    const [user] = useAbortFetch(fetchUser, frameKey);
    const [connected, setConnected] = useState(false);
    const [gamestate, setGamestate] = useState<GameState | null>(null);
    const [activityType, setActivityType] = useState<'playing' | 'observing'>('playing');

    useEffect(() => setConnected(user && user.gsiActive), [user]);

    useEffect(() => {
        if(message) {
            if(isGsiConnectedMessage(message)) {
                setConnected(message.value);
            }

            if(isGsiGameStateMessage(message)) {
                setGamestate(message.value);
            }

            if(isOverlayMessage(message)) {
                setCacheKey(message.date);
            }

            if(isGsiGameDataMessage(message) && message.value) {
                setActivityType(message.value.type);
            }
        }
    }, [message])

    const active = useMemo<boolean>(() => {
        return connected 
        && activityType === 'playing'
        && visibleGameStates.has(gamestate)
    }, [connected, gamestate, user]);

    return <AnimatePresence>
        {(active || testing) && <motion.div initial={'hidden'} animate={'visible'} exit={'hidden'} variants={variants} transition={{ duration: 1, type: "tween"}}>
            <OverlayImage key={cacheKey} frameApiKey={frameKey} />
        </motion.div>}
    </AnimatePresence>;
}