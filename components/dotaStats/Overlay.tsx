import { ReactElement, useState, useEffect } from "react";
import { DotaStats as DotaStatsEntitiy, User } from "@streamdota/shared-types";
import { useMessageListener } from "../websocket/MessageHandler";
import { get } from "../../modules/Network";
import { useAbortFetch } from "../../hooks/abortFetch";
import { MessageType } from "../websocket/state";
import DotaOverlayFrame from "./DotaOverlayFrame";


export async function fetchStats(abortController: AbortController, apiKey: string): Promise<DotaStatsEntitiy[]> {
    return (await get<DotaStatsEntitiy[]>('/user/dotaStats/' + apiKey, 'json', {signal: abortController.signal}));
}

export async function fetchUser(abortController: AbortController, apiKey: string): Promise<User> {
    return (await get<User>('/user/baseData?frameApiKey=' + apiKey, 'json', {signal: abortController.signal}));
}

export default function Overlay({frameKey}: {frameKey: string}): ReactElement | null {
    const message = useMessageListener();
    const [status] = useAbortFetch(fetchStats, frameKey);
    const [user] = useAbortFetch(fetchUser, frameKey);
    const [wins, setWins] = useState(0);
    const [lost, setLost] = useState(0);
    const [active, setActive] = useState(false);

    useEffect(() => setActive(user && user.gsiActive), [user]);

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
        if(message && message.type === MessageType.winner) {
            if(message.value) {
                setWins(wins + 1);
            } else {
                setLost(lost + 1);
            }
        } else if(message && message.type === MessageType.connected) {
            setActive(message.value);
        }
    }, [message])

    if(active) {
        return <DotaOverlayFrame wins={wins} loss={lost} auth={frameKey} />;
    }
    return null;
}