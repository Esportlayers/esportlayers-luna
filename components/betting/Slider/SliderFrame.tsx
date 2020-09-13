import React, { ReactElement, useMemo, useState, useEffect } from "react";
import GoogleFontLoader from "react-google-font-loader";
import { useBetStateValue } from "../Context";
import { useAbortFetch } from "../../../hooks/abortFetch";
import { fetchOverlay } from "../Timer/TimerFrame";
import DistributionSlider from "./DistributionSlider";
import { useMessageListener } from "../../websocket/MessageHandler";
import dayjs from "dayjs";
import { isOverlayMessage } from "../../websocket/state";
import { fetchUser } from "../../dotaStats/Overlay";

interface Props {
    auth: string;
    testing: boolean;
}

export default function Frame({auth, testing}: Props): ReactElement | null {
    const [overlay, reload] = useAbortFetch(fetchOverlay, auth);
    const [user, reloadUser] = useAbortFetch(fetchUser, auth);
    const [{betRound}] = useBetStateValue();

    const distribution = useMemo(() => {
        const {aBets, total} = betRound || {aBets: 1, total: 2};

        if(total === 0) {
            return 50;
        }
        
        return (aBets * 100) / total;
    }, [betRound]);

    const message = useMessageListener();
    const [cacheKey, setCacheKey] = useState(dayjs().unix());

    useEffect(() => {
        if(message) {
            if(isOverlayMessage(message)) {
                reload();
                reloadUser();
                setCacheKey(message.date);
            }
        }
    }, [message])

    if(overlay && (betRound.status === 'betting' || testing)) {
        return <div key={cacheKey}>
            {overlay.fontFamily && <GoogleFontLoader fonts={[{font: overlay.fontFamily, weights: [overlay.fontVariant]}]} />}
            <DistributionSlider overlay={overlay} distribution={distribution} delay={user && user.streamDelay} aBets={betRound.aBets} bBets={betRound.bBets} teamA={user.teamAName} teamB={user.teamBName}/>
            <style jsx global>{`
                body, html {
                    margin: 0;
                    padding: 0;
                }
            `}</style>
        </div>;
    }

    return null;
}