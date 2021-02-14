import { ReactElement } from "react";
import getWebsocketUrl from "../../../modules/Router";
import { useAbortFetch } from "../../../hooks/abortFetch";
import { fetchUser } from "../../antiSnipe/Overlay";
import Tether from "@esportlayers/io";
import Overlay from "../../casting/draftStats/Overlay";

interface Props {
    auth: string;
    testing: boolean;
}

export default function DraftStatsPage({auth, testing}: Props): ReactElement {
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
