import { ReactElement, useState, useEffect, useMemo } from "react";
import { DotaStats as DotaStatsEntitiy, User } from "@streamdota/shared-types";
import { useMessageListener } from "../websocket/MessageHandler";
import { get } from "../../modules/Network";
import { useAbortFetch } from "../../hooks/abortFetch";
import { GameState, isOverlayMessage, isGsiWinnerMessage, isGsiConnectedMessage, isGsiGameStateMessage, isGsiGameDataMessage } from "../websocket/state";
import DotaOverlayFrame from "./DotaOverlayFrame";
import dayjs from "dayjs";

export async function fetchStats(abortController: AbortController, apiKey: string): Promise<DotaStatsEntitiy[]> {
    return (await get<DotaStatsEntitiy[]>('/user/dotaStats/' + apiKey, 'json', {signal: abortController.signal}));
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

export default function Overlay({frameKey, testing}: {frameKey: string; testing: boolean;}): ReactElement | null {
    const message = useMessageListener();
    const [cacheKey, setCacheKey] = useState(dayjs().unix());
    const [status] = useAbortFetch(fetchStats, frameKey);
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
            if(isGsiWinnerMessage(message)) {
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

            if(isGsiGameDataMessage(message)) {
                setActivityType(message.value.type);
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

    if(active || testing) {
        return <DotaOverlayFrame wins={wins} loss={lost} auth={frameKey} key={cacheKey} />;
    }
    return null;
}