import { ReactElement } from "react";
import ToplistFrame from "../../components/betting/Toplist/ToplistFrame";
import { Wisp } from "@esportlayers/io";
import getWebsocketUrl from "../../modules/Router";
import { useAbortFetch } from "../../hooks/abortFetch";
import { fetchUser } from "../../components/antiSnipe/Overlay";

function Toplist({auth, testing}: {auth: string; testing: boolean}): ReactElement {
    const [user] = useAbortFetch(fetchUser, auth);
    if(user) {
        return <Wisp url={getWebsocketUrl() + '/bets/live/' + auth}>
            <ToplistFrame auth={auth} testing={testing} />
        </Wisp>;
    }

    return null;
}

Toplist.getInitialProps = ({query: {auth, testing}}) => {
    return {auth, testing: Boolean(testing)};
}

export default Toplist;