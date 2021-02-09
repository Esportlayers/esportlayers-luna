import { ReactElement } from "react";
import getWebsocketUrl from "../modules/Router";
import dynamic from "next/dynamic";
import Tether from "@esportlayers/io";

const Overlay = dynamic(
    () => import('../components/dotaStats/Overlay'),
    { ssr: false }
);

function DotaStats({auth, testing}: {auth: string, testing: boolean}): ReactElement {
    return <Tether url={getWebsocketUrl()+'/dota-gsi/live/' + auth}>
        <Overlay frameKey={auth} testing={testing}/>

        <style global jsx>{`
            html, body {
                height: 60px!important;
                background-color: transparent;
            }    
        `}</style>
    </Tether>;
}

DotaStats.getInitialProps = ({query: {auth, testing}}) => {
    return {auth, testing: Boolean(testing)};
}

export default DotaStats;