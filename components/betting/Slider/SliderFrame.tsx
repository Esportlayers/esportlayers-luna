import React, { ReactElement, useMemo, useState, useEffect } from "react";
import GoogleFontLoader from "react-google-font-loader";
import { useAbortFetch } from "../../../hooks/abortFetch";
import { fetchOverlay } from "../Timer/TimerFrame";
import DistributionSlider from "./DistributionSlider";
import dayjs from "dayjs";
import { fetchUser } from "../../dotaStats/Overlay";
import { get } from "../../../modules/Network";
import { EventTypes, OverlayMessage, useTetherMessageListener, useVoteValue } from "@esportlayers/io";

interface Props {
    auth: string;
    testing: boolean;
}


export async function fetchBetCommand(abortController: AbortController, key: string): Promise<string> {
    const data = await get<{command: string}>('/betsOverlay/bettingCommand?frameApiKey=' + key, 'json', {signal: abortController.signal});
    return data.command;
}

export default function Frame({auth, testing}: Props): ReactElement | null {
    const [overlay, reload] = useAbortFetch(fetchOverlay, auth);
    const [user, reloadUser] = useAbortFetch(fetchUser, auth);
    const [command, reloadCommand] = useAbortFetch(fetchBetCommand, auth);
    const [betRound] = useVoteValue();

    const distribution = useMemo(() => {
        const {teamACount, totalVotesCount} = betRound || {teamACount: 1, totalVotesCount: 2};

        if(totalVotesCount === 0) {
            return 50;
        }
        
        return (teamACount * 100) / totalVotesCount;
    }, [betRound]);

    const {date: lastOverlayMessageDate} = useTetherMessageListener<OverlayMessage>(EventTypes.overlay) || {date: null};
    const [cacheKey, setCacheKey] = useState(dayjs().unix());

    useEffect(() => {
        reload();
        reloadUser();
        reloadCommand();
        setCacheKey(lastOverlayMessageDate);
    }, [lastOverlayMessageDate])

    if(overlay &&  ((betRound && betRound.overlayVisible) || testing)) {
        return <div key={cacheKey}>
            {overlay.fontFamily && <GoogleFontLoader fonts={[{font: overlay.fontFamily, weights: [overlay.fontVariant]}]} />}
            <DistributionSlider overlay={overlay} distribution={distribution} delay={user && user.streamDelay} aBets={betRound?.teamACount || 0} bBets={betRound?.teamBCount || 0} teamA={user?.teamAName} teamB={user?.teamBName} command={command}/>
            <style jsx global>{`
                body, html {
                    margin: 0;
                    padding: 0;
                    background-color: rgba(0, 0, 0, 0);
                }
            `}</style>
        </div>;
    }

    return null;
}