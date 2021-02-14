import React, { ReactElement, useState, useEffect, useMemo } from "react";
import { DotaStats as DotaStatsEntitiy, User } from "@streamdota/shared-types";
import { get } from "../../modules/Network";
import { useAbortFetch } from "../../hooks/abortFetch";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import OverlayImage from "./OverlayImage";
import { EventTypes, GsiActivityMessage, GsiConnectedMessage, GsiGameStateMessage, OverlayMessage, useTetherMessageListener } from "@esportlayers/io";
import { GameState } from "@esportlayers/morphling";


export async function fetchStats(abortController: AbortController, apiKey: string): Promise<DotaStatsEntitiy[]> {
    return (await get<DotaStatsEntitiy[]>('/user/dotaStats?frameApiKey=' + apiKey, 'json', {signal: abortController.signal}));
}

export async function fetchUser(abortController: AbortController, apiKey: string): Promise<User> {
    return (await get<User>('/user/baseData?frameApiKey=' + apiKey, 'json', {signal: abortController.signal}));
}

const visibleGameStates = new Set([
    GameState.running,
    GameState.preGame,
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
    const [cacheKey, setCacheKey] = useState(dayjs().unix());
    const [user] = useAbortFetch(fetchUser, frameKey);
    const [connected, setConnected] = useState(false);
    const [gamestate, setGamestate] = useState<GameState | null>(null);
    const [activityType, setActivityType] = useState<'playing' | 'observing'>('playing');

    useEffect(() => setConnected(user && user.gsiActive), [user]);

    const {value: isConnected} = useTetherMessageListener<GsiConnectedMessage>(EventTypes.gsi_connected) || {value: false};
    const {value: gameStateMessageValue} = useTetherMessageListener<GsiGameStateMessage>(EventTypes.gsi_game_state) || {value: null};
    const {value: activityMessage} = useTetherMessageListener<GsiActivityMessage>(EventTypes.gsi_game_activity) || {value: null};
    const {date: lastOverlayMessage} = useTetherMessageListener<OverlayMessage>(EventTypes.overlay) || {date: null};
    
    useEffect(() => setConnected(isConnected), [isConnected]);
    useEffect(() => setGamestate(gameStateMessageValue), [gameStateMessageValue]);
    useEffect(() => setCacheKey(lastOverlayMessage), [lastOverlayMessage]);
    useEffect(() => setActivityType(activityMessage), [activityMessage]);


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