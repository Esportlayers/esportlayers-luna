import Tether, { Wisp } from "@esportlayers/io";
import AntiSnipeOverlay from "../components/antiSnipe/Overlay";
import ToplistOverlay from "../components/betting/Toplist/ToplistFrame";
import TimerOverlay from "../components/betting/Timer/TimerFrame";
import SliderOverlay from "../components/betting/Slider/SliderFrame";
import DotaStatsOverlay, { fetchUser } from "../components/dotaStats/Overlay";
import getWebsocketUrl from "../modules/Router";
import React, { ReactElement } from "react";
import RoshanTimerOverlay from "../components/casting/roshanTimer/Overlay";
import DraftStatsOverlay from "../components/casting/draftStats/Overlay";
import HeroStatsOverlay from "../components/casting/playerCompareStats/Overlay";
import { useAbortFetch } from "../hooks/abortFetch";

function General({auth, testing}: {auth: string, testing: boolean}): ReactElement | null {
    const [user] = useAbortFetch(fetchUser, auth);

    if(user) {
        return <Tether url={getWebsocketUrl()+'/dota-gsi/live/' + auth}>
            {!user.individualOverlayWLStats && <DotaStatsOverlay frameKey={auth} testing={testing}/>}
            {!user.individualOverlayMinimap && <AntiSnipeOverlay frameKey={auth} testing={testing}/>}

            {!user.individualOverlayRoshTimer && <RoshanTimerOverlay testing={testing} auth={auth}/>}
            {!user.individualOverlayDraftStats && <DraftStatsOverlay testing={testing}/>}
            {!user.individualOverlayVoteHeroStats && <HeroStatsOverlay testing={testing}/>}
            
            <Wisp url={getWebsocketUrl() + '/bets/live/' + auth}>
                {!user.individualOverlayVoteToplist && <ToplistOverlay auth={auth} testing={testing} />}
                {!user.individualOverlayVoteTimer && <TimerOverlay auth={auth} testing={testing} />}
                {!user.individualOverlayVoteDistribution && <SliderOverlay auth={auth} testing={testing} />}
            </Wisp>
        </Tether>
    }

    return null;
}

General.getInitialProps = ({query: {auth, testing}}) => {
    return {auth, testing: Boolean(testing)};
}

export default General;