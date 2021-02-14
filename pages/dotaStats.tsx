import { ReactElement } from "react";
import getWebsocketUrl from "../modules/Router";
import dynamic from "next/dynamic";
import Tether from "@esportlayers/io";
import { useAbortFetch } from "../hooks/abortFetch";
import { fetchUser } from "../components/dotaStats/Overlay";

const Overlay = dynamic(
    () => import('../components/dotaStats/Overlay'),
    { ssr: false }
);

function DotaStats({auth, testing}: {auth: string, testing: boolean}): ReactElement {
    const [user] = useAbortFetch(fetchUser, auth);
    if(user && Boolean(user.useDotaStatsOverlay)) {
        return <Tether url={getWebsocketUrl()+'/dota-gsi/live/' + auth}>
            <Overlay frameKey={auth} testing={testing}/>

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

DotaStats.getInitialProps = ({query: {auth, testing}}) => {
    return {auth, testing: Boolean(testing)};
}

export default DotaStats;