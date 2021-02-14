import { ReactElement } from "react";
import getWebsocketUrl from "../../modules/Router";
import { useAbortFetch } from "../../hooks/abortFetch";
import { fetchUser } from "../../components/antiSnipe/Overlay";
import Tether from "@esportlayers/io";
import Overlay from "../../components/casting/roshanTimer/Overlay";

interface Props {
    auth: string;
    testing: boolean;
}

function RoshanTimer({auth, testing}: Props): ReactElement {
    const [user] = useAbortFetch(fetchUser, auth);
    if(user && Boolean(user.useMinimapOverlay)) {
        return <Tether url={getWebsocketUrl()+'/dota-gsi/live/' + auth}>
            <Overlay testing={testing} auth={auth}/>

            <style global jsx>{`
                html, body {
                    height: 60px!important;
                    background-color: transparent;
                }    
            `}</style>
        </Tether>;
    }
    return null;
}

RoshanTimer.getInitialProps = ({query: {auth, testing}}) => {
    return {auth, testing};
}

export default RoshanTimer;