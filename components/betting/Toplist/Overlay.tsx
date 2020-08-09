import React, { ReactElement, useState, useEffect } from "react";
import { BetSeasonToplist } from "@streamdota/shared-types";
import { useAbortFetch } from "../../../hooks/abortFetch";
import { get } from "../../../modules/Network";
import { fetchOverlay } from "../Timer/TimerFrame";
import Toplist from "./Toplist";
import GoogleFontLoader from "react-google-font-loader";
import { useMessageListener } from "../../websocket/MessageHandler";
import { useBetStateValue } from "../Context";

interface Props {
    auth: string;
    season: number;
}

export async function fetchToplist(abortController: AbortController, key: string, season: number): Promise<BetSeasonToplist[]> {
    return await get<BetSeasonToplist[]>(`/betSeason/toplist/${season}?frameApiKey=${key}`, 'json', {signal: abortController.signal});
}

export default React.memo(function Overlay({auth, season}: Props): ReactElement | null {
    const [overlay] = useAbortFetch(fetchOverlay, auth);
    const [toplist, reload] = useAbortFetch(fetchToplist, auth, season);
    const [{betRound}] = useBetStateValue();
    const [status, setStatus] = useState('');
    useEffect(() => setStatus(betRound?.status || ''), [betRound]);
    useEffect(() => {
        reload();
    }, [status]);

    if(overlay && toplist) {
        return <>
            {overlay.fontFamily && <GoogleFontLoader fonts={[{font: overlay.fontFamily, weights: [overlay.fontVariant]}]} />}
            <Toplist list={toplist} overlay={overlay} />
            <style jsx global>{`
                body, html {
                    margin: 0;
                    padding: 0;
                }
            `}</style>
        </>;
    }
    return null;
});