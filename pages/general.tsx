import Tether, { Wisp } from "@esportlayers/io";
import AntiSnipeOverlay from "../components/antiSnipe/Overlay";
import ToplistOverlay from "../components/betting/Toplist/ToplistFrame";
import TimerOverlay from "../components/betting/Timer/TimerFrame";
import SliderOverlay from "../components/betting/Slider/SliderFrame";
import DotaStatsOverlay from "../components/dotaStats/Overlay";
import getWebsocketUrl from "../modules/Router";
import React, { ReactElement } from "react";
import RoshanTimerOverlay from "../components/casting/roshanTimer/Overlay";
import DraftStatsOverlay from "../components/casting/draftStats/Overlay";
import HeroStatsOverlay from "../components/casting/playerCompareStats/Overlay";

function General({auth, testing}: {auth: string, testing: boolean}): ReactElement {
    return <Tether url={getWebsocketUrl()+'/dota-gsi/live/' + auth}>
        <DotaStatsOverlay frameKey={auth} testing={testing}/>
        <AntiSnipeOverlay frameKey={auth} testing={testing}/>

        <RoshanTimerOverlay testing={testing} auth={auth}/>
        <DraftStatsOverlay testing={testing}/>
        <HeroStatsOverlay testing={testing}/>
        
        <Wisp url={getWebsocketUrl() + '/bets/live/' + auth}>
            <ToplistOverlay auth={auth} testing={testing} />
            <TimerOverlay auth={auth} testing={testing} />
            <SliderOverlay auth={auth} testing={testing} />
        </Wisp>
    </Tether>
}

General.getInitialProps = ({query: {auth, testing}}) => {
    return {auth, testing: Boolean(testing)};
}

export default General;