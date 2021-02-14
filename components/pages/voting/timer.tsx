import { ReactElement } from "react";
import TimerFrame from "../../betting/Timer/TimerFrame";
import { Wisp } from "@esportlayers/io";
import getWebsocketUrl from "../../../modules/Router";
import { useAbortFetch } from "../../../hooks/abortFetch";
import { fetchUser } from "../../antiSnipe/Overlay";

export default function TimerPage({auth, testing}: {auth: string; testing: boolean}): ReactElement {
    const [user] = useAbortFetch(fetchUser, auth);
    if(user && Boolean(user.useVoteTimerOverlay)) {
        return <Wisp url={getWebsocketUrl() + '/bets/live/' + auth}>
            <TimerFrame fullSize auth={auth} testing={testing}/>
        </Wisp>;
    }

    return null;
}