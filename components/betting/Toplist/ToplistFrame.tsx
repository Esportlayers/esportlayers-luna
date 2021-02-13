import React, { ReactElement, useState, useEffect } from "react";
import Overlay from "./Overlay";
import dayjs from "dayjs";
import { useAbortFetch } from "../../../hooks/abortFetch";
import { fetchUser } from "../../dotaStats/Overlay";
import { EventTypes, GsiGameStateMessage, OverlayMessage, useTetherMessageListener } from "@esportlayers/io";

interface Props {
    auth: string;
    testing: boolean;
}

export default function Frame({auth, testing}: Props): ReactElement | null {
    const [user] = useAbortFetch(fetchUser, auth);
    const [cacheKey, setCacheKey] = useState(dayjs().unix());

    const {date: gameStateDate} = useTetherMessageListener<GsiGameStateMessage>(EventTypes.gsi_game_state) || {date: null};
    const {date: lastOverlayMessage} = useTetherMessageListener<OverlayMessage>(EventTypes.overlay) || {date: null};
    useEffect(() => setCacheKey(gameStateDate), [gameStateDate]);
    useEffect(() => setCacheKey(lastOverlayMessage), [lastOverlayMessage]);

    if(user) {
        return <Overlay season={user.betSeasonId} auth={auth} key={cacheKey} testing={testing}/>;
    }

    return null;
}