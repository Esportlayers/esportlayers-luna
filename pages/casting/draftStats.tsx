import { ReactElement } from "react";
import getWebsocketUrl from "../../modules/Router";
import { useAbortFetch } from "../../hooks/abortFetch";
import { fetchUser } from "../../components/antiSnipe/Overlay";
import Tether from "@esportlayers/io";
import Overlay from "../../components/casting/draftStats/Overlay";

interface Props {
    auth: string;
    testing: boolean;
}

function RoshanTimer({auth, testing}: Props): ReactElement {
    const [user] = useAbortFetch(fetchUser, auth);
    if(user && Boolean(user.useDraftStatsOverlay)) {
        return <Tether url={getWebsocketUrl()+'/dota-gsi/live/' + auth}>
            <Overlay testing={testing}/>

            <style global jsx>{`
                html, body {
                    height: 6rem;
                    background-color: transparent;
                    font-family: Arial;
                    padding: 5px 0;
                    margin: 0;
                    display: flex;
                    justify-content: flex-end;
                    font-size: 28px;
                    max-width: 100%;
                    overflow: hidden;
                    width: 100%;
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
