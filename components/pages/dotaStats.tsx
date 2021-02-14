import { ReactElement } from "react";
import getWebsocketUrl from "../../modules/Router";
import Tether from "@esportlayers/io";
import { useAbortFetch } from "../../hooks/abortFetch";
import Overlay, { fetchUser } from "../dotaStats/Overlay";

export default function DotaStatsPage({auth, dynamicNumbers, testing}: {auth: string, dynamicNumbers: boolean, testing: boolean}): ReactElement {
    const [user] = useAbortFetch(fetchUser, auth);
    if(user && Boolean(user.useDotaStatsOverlay)) {
        return <Tether url={getWebsocketUrl()+'/dota-gsi/live/' + auth}>
            <Overlay frameKey={auth} testing={testing} dynamicNumbers={dynamicNumbers}/>

            <style global jsx>{`
                html, body {
                    height: 60px!important;
                    width: 160px!important;
                    background-color: transparent;
                }    
            `}</style>
        </Tether>;
    }
    return null;
}