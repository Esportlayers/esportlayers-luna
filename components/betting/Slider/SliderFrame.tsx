import React, { ReactElement, useMemo } from "react";
import GoogleFontLoader from "react-google-font-loader";
import { useBetStateValue } from "../Context";
import { useAbortFetch } from "../../../hooks/abortFetch";
import { fetchOverlay } from "../Timer/TimerFrame";
import DistributionSlider from "./DistributionSlider";

interface Props {
    auth: string;
    testing: boolean;
}

export default React.memo(function Frame({auth, testing}: Props): ReactElement | null {
    const [overlay] = useAbortFetch(fetchOverlay, auth);
    const [{betRound}] = useBetStateValue();

    const distribution = useMemo(() => {
        const {aBets, total} = betRound || {aBets: 1, total: 2};

        if(total === 0) {
            return 50;
        }
        
        return (aBets * 100) / total;
    }, [betRound]);

    if(overlay && (betRound.status === 'betting' || testing)) {
        return <>
            {overlay.fontFamily && <GoogleFontLoader fonts={[{font: overlay.fontFamily, weights: [overlay.fontVariant]}]} />}
            <DistributionSlider overlay={overlay} distribution={distribution} />
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