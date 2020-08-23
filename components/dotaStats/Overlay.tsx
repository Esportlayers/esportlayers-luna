import { ReactElement, useState, useEffect, useMemo } from "react";
import { DotaStats as DotaStatsEntitiy, User } from "@streamdota/shared-types";
import { useMessageListener } from "../websocket/MessageHandler";
import { get } from "../../modules/Network";
import { useAbortFetch } from "../../hooks/abortFetch";
import { isWinnerMessage, isConnectedMessgae, isGameStateMessage, GameState } from "../websocket/state";
import DotaOverlayFrame from "./DotaOverlayFrame";

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

export default function Overlay({frameKey}: {frameKey: string}): ReactElement | null {
    const message = useMessageListener();
    const [status] = useAbortFetch(fetchStats, frameKey);
    const [user] = useAbortFetch(fetchUser, frameKey);
    const [wins, setWins] = useState(0);
    const [lost, setLost] = useState(0);
    const [connected, setConnected] = useState(false);
    const [gamestate, setGamestate] = useState<GameState | null>(GameState.DOTA_GAMERULES_STATE_WAIT_FOR_PLAYERS_TO_LOAD);

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
            if(isWinnerMessage(message)) {
                if(message.value) {
                    setWins(wins + 1);
                } else {
                    setLost(lost + 1);
                }
            }

            if(isConnectedMessgae(message)) {
                setConnected(message.value);
            }

            if(isGameStateMessage(message)) {
                setGamestate(message.value);
            }
        }
    }, [message])

    const active = useMemo<boolean>(() => {
        return connected 
        && (
            visibleGameStates.has(gamestate)
         || (!user.dotaStatsMenuHidden && (!gamestate || mainMenuGameState.has(gamestate))) 
         || (!user.dotaStatsPickHidden && pickGameStates.has(gamestate)));
    }, [connected, user]);

    if(active) {
        return <DotaOverlayFrame wins={wins} loss={lost} auth={frameKey} />;
    }
    return null;
}