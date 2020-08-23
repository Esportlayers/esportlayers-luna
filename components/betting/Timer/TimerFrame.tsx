import React, { ReactElement, useState } from "react";
import GoogleFontLoader from "react-google-font-loader";
import dayjs from "dayjs";
import { BetRoundStats, BetOverlay } from "@streamdota/shared-types";
import { useBetStateValue } from "../Context";
import { useInterval } from "../../../hooks/interval";
import { useAbortFetch } from "../../../hooks/abortFetch";
import { get } from "../../../modules/Network";
import { getVariant } from "../../dotaStats/DotaOverlayFrame";

interface Props {
    auth: string;
    testing: boolean;
}

function calculateRemaining(currentBetRound: BetRoundStats): string {
    if(currentBetRound?.status === 'betting') {
        const finish = currentBetRound.created + 90;
        const diff = finish - dayjs().unix();
        if(diff > 0) {
            const min = Math.floor(diff / 60);
            let sec: number | string = diff % 60;
            sec = sec < 10  ? '0' + sec : sec;
            return `${min}:${sec}`;
        }
        return '0:00';
    }
    return '0:00';
}


export async function fetchOverlay(abortController: AbortController, key: string): Promise<BetOverlay> {
    return await get<BetOverlay>('/betsOverlay?frameApiKey=' + key, 'json', {signal: abortController.signal});
}

export default React.memo(function Frame({auth, testing}: Props): ReactElement | null {
    const [overlay] = useAbortFetch(fetchOverlay, auth);
    const [{betRound}] = useBetStateValue();
    const [timer, setTimer] = useState(calculateRemaining(betRound));
    useInterval(() => setTimer(calculateRemaining(betRound)));

    if(overlay && (betRound.status === 'betting' || testing)) {
        return <div className={'wrapper'}>
            {overlay.fontFamily && <GoogleFontLoader fonts={[{font: overlay.fontFamily, weights: [overlay.fontVariant]}]} />}
    
            <div className={'counter'} style={{...getVariant(overlay.fontVariant)}}>{timer}</div>
    
            <style jsx global>{`
                body, html {
                    margin: 0;
                    padding: 0;
                }
            `}</style>
            <style jsx>{`
                .wrapper {
                    background-color: ${overlay.timerBackground};
                    font-size: ${overlay.timerFontSize}px;
                    height: 100vh;
                    width: 100vw;
                    line-height: 1em;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
    
                .counter {
                    font-family: ${overlay.fontFamily};
                    color: ${overlay.timerFont};
                }
            `}</style>
        </div>;
    }
    return null;
});