import { ReactElement } from "react";
import dynamic from "next/dynamic";
import getWebsocketUrl from "../../modules/Router";
import { initialState, reducer } from "../../components/websocket/state";

const ContextProvider = dynamic(
    () => import('../../components/websocket/context'),
    { ssr: false }
);

const Overlay = dynamic(
    () => import('../../components/casting/draftStats/Overlay'),
    { ssr: false }
);

interface Props {
    auth: string;
    testing: boolean;
}

function RoshanTimer({auth, testing}: Props): ReactElement {
    return <ContextProvider initialState={initialState} reducer={reducer} url={getWebsocketUrl()+'/dota-gsi/live/' + auth}>
        <Overlay testing={testing}/>

        <style global jsx>{`
            html, body {
                height: 4rem;
                background-color: transparent;
                font-family: Arial;
                padding: 5px 0;
                margin: 0;
                display: flex;
                justify-content: flex-end;
                font-size: 28px;
                max-width: 100%;
                overflow: hidden;
            }    
        `}</style>
    </ContextProvider>;
}

RoshanTimer.getInitialProps = ({query: {auth, testing}}) => {
    return {auth, testing};
}

export default RoshanTimer;
