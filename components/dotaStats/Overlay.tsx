import { ReactElement, useState, useEffect } from "react";
import { DotaStats as DotaStatsEntitiy } from "@streamdota/shared-types";
import { useMessageListener } from "../websocket/MessageHandler";
import { get } from "../../modules/Network";
import { useAbortFetch } from "../../hooks/abortFetch";
import { MessageType } from "../websocket/state";
import Frame from "./Frame";


export async function fetchStats(abortController: AbortController, apiKey: string): Promise<DotaStatsEntitiy[]> {
    return (await get<DotaStatsEntitiy[]>('/user/dotaStats/' + apiKey, 'json', {signal: abortController.signal}));
}

export default function Overlay({frameKey}: {frameKey: string}): ReactElement {
    const message = useMessageListener();
    const [status] = useAbortFetch(fetchStats, frameKey);
    const [wins, setWins] = useState(0);
    const [lost, setLost] = useState(0);

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
        }
    }, [message])

    return <Frame wins={wins} loss={lost} auth={frameKey} />;
}