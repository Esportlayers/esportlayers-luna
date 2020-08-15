import { ReactElement } from "react";
import dynamic from "next/dynamic";
import { initialState, reducer } from "../../components/betting/State";
import getWebsocketUrl from "../../modules/Router";

const ContextProvider = dynamic(
    () => import('../../components/websocket/context'),
    { ssr: false }
);

const Overlay = dynamic(
    () => import('../../components/casting/roshanTimer/Overlay'),
    { ssr: false }
);

function RoshanTimer({auth}: {auth: string}): ReactElement {
    return <ContextProvider initialState={initialState} reducer={reducer} url={getWebsocketUrl()+'/dota-gsi/live/' + auth}>
        <Overlay />

        <style global jsx>{`
            html, body {
                height: 60px!important;
                background-color: transparent;
            }    
        `}</style>
    </ContextProvider>;
}

RoshanTimer.getInitialProps = ({query: {auth}}) => {
    return {auth};
}

export default RoshanTimer;