import { ReactElement } from "react";
import dynamic from "next/dynamic";
import getWebsocketUrl from "../../modules/Router";
import { initialState, reducer } from "../../components/websocket/state";

const ContextProvider = dynamic(
    () => import('../../components/websocket/context'),
    { ssr: false }
);

const Overlay = dynamic(
    () => import('../../components/casting/playerCompareStats/Overlay'),
    { ssr: false }
);

interface Props {
    auth: string;
    testing: boolean;
}

function PlayerCompareStats({auth, testing}: Props): ReactElement {
    return <ContextProvider initialState={initialState} reducer={reducer} url={getWebsocketUrl()+'/dota-gsi/live/' + auth}>
        <Overlay testing={testing}/>

        <style global jsx>{`
            html, body {
                background-color: transparent;
                font-family: Arial;
                padding: 0;
                margin: 0;
            }   
        `}</style>
    </ContextProvider>;
}

PlayerCompareStats.getInitialProps = ({query: {auth, testing}}) => {
    return {auth, testing};
}

export default PlayerCompareStats;