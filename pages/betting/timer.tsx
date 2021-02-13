import { ReactElement } from "react";
import TimerFrame from "../../components/betting/Timer/TimerFrame";
import { Wisp } from "@esportlayers/io";
import getWebsocketUrl from "../../modules/Router";
import { useAbortFetch } from "../../hooks/abortFetch";
import { fetchUser } from "../../components/antiSnipe/Overlay";
function Timer({auth, testing}: {auth: string; testing: boolean}): ReactElement {
    const [user] = useAbortFetch(fetchUser, auth);
    if(user) {
        return <Wisp url={getWebsocketUrl() + '/bets/live/' + auth}>
            <TimerFrame fullSize auth={auth} testing={testing}/>
        </Wisp>;
    }

    return null;
}

Timer.getInitialProps = ({query: {auth, testing}}) => {
    return {auth, testing: Boolean(testing)};
}

export default Timer;