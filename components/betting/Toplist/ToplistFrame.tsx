import React, { ReactElement } from "react";
import { useBetStateValue } from "../Context";
import Overlay from "./Overlay";

interface Props {
    auth: string;
}

export default React.memo(function Frame({auth}: Props): ReactElement | null {
    const [{betRound}] = useBetStateValue();

    if(betRound && betRound.betSeason !== 0) {
        return <Overlay season={betRound.betSeason} auth={auth}/>;
    }
    return null;
});