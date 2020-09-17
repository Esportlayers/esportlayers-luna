import React, { ReactElement, useState, useEffect, useMemo } from "react";
import { DotaStats as DotaStatsEntitiy, User } from "@streamdota/shared-types";
import { useMessageListener } from "../websocket/MessageHandler";
import { get } from "../../modules/Network";
import { useAbortFetch } from "../../hooks/abortFetch";
import { GameState, isOverlayMessage, isGsiWinnerMessage, isGsiConnectedMessage, isGsiGameStateMessage, isGsiGameDataMessage, isDotaWLReset } from "../websocket/state";
import DotaOverlayFrame from "./DotaOverlayFrame";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";


export async function fetchStats(abortController: AbortController, apiKey: string): Promise<DotaStatsEntitiy[]> {
    return (await get<DotaStatsEntitiy[]>('/user/dotaStats?frameApiKey=' + apiKey, 'json', {signal: abortController.signal}));
}

export async function fetchUser(abortController: AbortController, apiKey: string): Promise<User> {
    return (await get<User>('/user/baseData?frameApiKey=' + apiKey, 'json', {signal: abortController.signal}));
}

const visibleGameStates = new Set([
    GameState.DOTA_GAMERULES_STATE_WAIT_FOR_PLAYERS_TO_LOAD,
    GameState.DOTA_GAMERULES_STATE_GAME_IN_PROGRESS,
    GameState.DOTA_GAMERULES_STATE_PRE_GAME,
]);

const pickGameStates = new Set([
    GameState.DOTA_GAMERULES_STATE_STRATEGY_TIME,
    GameState.DOTA_GAMERULES_STATE_HERO_SELECTION,
]);

const mainMenuGameState = new Set([
    GameState.DOTA_GAMERULES_STATE_POST_GAME,
]);

const variants = {
    hidden: {
        y: 60,
        opacity: 0,
    },
    visible: {
        y: 0,
        opacity: 1,
    }
}

export default function Overlay({frameKey, testing}: {frameKey: string; testing: boolean;}): ReactElement | null {
    const message = useMessageListener();
    const [cacheKey, setCacheKey] = useState(dayjs().unix());
    const [status, reloadStats] = useAbortFetch(fetchStats, frameKey);
    const [user] = useAbortFetch(fetchUser, frameKey);
    const [wins, setWins] = useState(0);
    const [lost, setLost] = useState(0);
    const [connected, setConnected] = useState(false);
    const [gamestate, setGamestate] = useState<GameState | null>(null);
    const [activityType, setActivityType] = useState<'playing' | 'observing'>('playing');

    useEffect(() => setConnected(user && user.gsiActive), [user]);

    useEffect(() => {
        if(status) {
            let localWins = 0, localLost = 0;
            status.forEach(({won}) => {
                if(won) {
                    localWins++;
                } else {
                    localLost++;
                }
            });
            setWins(localWins + wins);
            setLost(localLost + lost);
        }
    }, [status]);

    useEffect(() => {
        if(message) {
            if(isGsiWinnerMessage(message) && message.value?.winnerTeam !== 'none') {
                if(message.value.isPlayingWin) {
                    setWins(wins + 1);
                } else {
                    setLost(lost + 1);
                }
            }
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

            if(isDotaWLReset(message)) {
                setWins(0);
                setLost(0);
                reloadStats();
            }
        }
    }, [message])

    const active = useMemo<boolean>(() => {
        return connected 
        && activityType === 'playing'
        && (
            visibleGameStates.has(gamestate)
         || (!Boolean(user.dotaStatsMenuHidden) && (!gamestate || mainMenuGameState.has(gamestate))) 
         || (!Boolean(user.dotaStatsPickHidden) && pickGameStates.has(gamestate)));
    }, [connected, gamestate, user]);

    return <AnimatePresence>
        {(active || testing) && <motion.div initial={'hidden'} animate={'visible'} exit={'hidden'} variants={variants} transition={{ duration: 2, type: "tween"}}>
            <DotaOverlayFrame wins={wins} loss={lost} auth={frameKey} key={cacheKey} />
        </motion.div>}
    </AnimatePresence>;
}