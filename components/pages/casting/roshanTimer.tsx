import { ReactElement } from "react";
import getWebsocketUrl from "../../../modules/Router";
import { useAbortFetch } from "../../../hooks/abortFetch";
import { fetchUser } from "../../antiSnipe/Overlay";
import Tether from "@esportlayers/io";
import Overlay from "../../casting/roshanTimer/Overlay";

interface Props {
    auth: string;
    testing: boolean;
}

export default function RoshanTimerPage({auth, testing}: Props): ReactElement {
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