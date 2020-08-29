import { ReactElement } from "react";
import { initialState, reducer } from "../components/websocket/state";
import getWebsocketUrl from "../modules/Router";
import dynamic from "next/dynamic";

const ContextProvider = dynamic(
    () => import('../components/websocket/context'),
    { ssr: false }
);

const Overlay = dynamic(
    () => import('../components/dotaStats/Overlay'),
    { ssr: false }
);

function DotaStats({auth, testing}: {auth: string, testing: boolean}): ReactElement {
    return <ContextProvider initialState={initialState} reducer={reducer} url={getWebsocketUrl()+'/dota-gsi/live/' + auth}>
        <Overlay frameKey={auth} testing={testing}/>

        <style global jsx>{`
            html, body {
                height: 60px!important;
                background-color: transparent;
            }    
        `}</style>
    </ContextProvider>;
}

DotaStats.getInitialProps = ({query: {auth, testing}}) => {
    return {auth, testing: Boolean(testing)};
}

export default DotaStats;