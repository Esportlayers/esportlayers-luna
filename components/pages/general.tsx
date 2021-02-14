import Tether, { Wisp } from "@esportlayers/io";
import AntiSnipeOverlay from "../antiSnipe/Overlay";
import ToplistOverlay from "../betting/Toplist/ToplistFrame";
import TimerOverlay from "../betting/Timer/TimerFrame";
import SliderOverlay from "../betting/Slider/SliderFrame";
import DotaStatsOverlay, { fetchUser } from "../dotaStats/Overlay";
import getWebsocketUrl from "../../modules/Router";
import React, { ReactElement } from "react";
import RoshanTimerOverlay from "../casting/roshanTimer/Overlay";
import DraftStatsOverlay from "../casting/draftStats/Overlay";
import HeroStatsOverlay from "../casting/playerCompareStats/Overlay";
import { useAbortFetch } from "../../hooks/abortFetch";

export default function GeneralPage({auth, testing}: {auth: string, testing: boolean}): ReactElement | null {
    const [user] = useAbortFetch(fetchUser, auth);

    if(user) {
        return <Tether url={getWebsocketUrl()+'/dota-gsi/live/' + auth}>
            {!user.individualOverlayWLStats && Boolean(user.useDotaStatsOverlay) && <div className={'dotaWl'}>
                <DotaStatsOverlay frameKey={auth} testing={testing}/>
            </div>}
            {!user.individualOverlayMinimap && Boolean(user.useMinimapOverlay) && <div className={'antiSnipe'}>
                <div className={'antiSnipeContainer'}>
                    <div className={'antiSnipeOverlay'}>
                        <AntiSnipeOverlay frameKey={auth} testing={testing}/>
                    </div>
                </div>
            </div>}

            {false && !user.individualOverlayRoshTimer && Boolean(user.useRoshanTimerOverlay) && <RoshanTimerOverlay testing={testing} auth={auth}/>}
            {false && !user.individualOverlayDraftStats && Boolean(user.useDraftStatsOverlay) && <DraftStatsOverlay testing={testing}/>}
            {false && !user.individualOverlayVoteHeroStats && Boolean(user.useHeroStatsOverlay) && <HeroStatsOverlay testing={testing}/>}

            <Wisp url={getWebsocketUrl() + '/bets/live/' + auth}>
                {!user.individualOverlayVoteToplist && Boolean(user.useVoteToplistOverlay) && <div className={'toplist'}><ToplistOverlay auth={auth} testing={testing} /></div>}
                <div className={'voteHeader'}>
                    {!user.individualOverlayVoteDistribution && Boolean(user.useVoteDistributionOverlay) &&  <div className={'voteSlider'}>
                        <SliderOverlay auth={auth} testing={testing} />
                    </div>}

                    {!user.individualOverlayVoteTimer && Boolean(user.useVoteTimerOverlay) && <div className={'timer'}>
                        <TimerOverlay auth={auth} testing={testing} />
                    </div>}
                </div>
            </Wisp>

            <style jsx global>{`
                body {
                    padding: 0;
                    padding-bottom: 56.25%!important;
                    margin: 0;
                    box-sizing: border-box;
                    position: absolute;
                    width: 100vw;
                }
            `}</style>

            <style jsx>{`
                .dotaWl {
                    position: absolute;
                    bottom: 0;
                    left: 19vw;
                    width: 7vw;
                }   

                .antiSnipe {
                    bottom: 0;
                    left: 0;
                    position: absolute;
                } 

                .antiSnipeContainer {
                    padding-top: 100%;
                    width: 14.6vw;
                }

                .antiSnipeOverlay {
                    position: absolute;
                    top: 0;
                    left: 3px;
                    right: 0;
                    bottom: 0;
                }

                .voteHeader {
                    width: 60vw;
                    top: 10vh;
                    position: absolute;
                    left: 50%;
                    transform: translate(-50%);
                }

                .timer {
                    margin-top: 2rem;
                    display: flex;
                    justify-content: center;
                }

                .toplist {
                    right: 0;
                    width: 20vw;
                    top: 50%;
                    transform: translateY(-50%);
                    position: absolute;
                }
            `}</style>
        </Tether>
    }

    return null;
}