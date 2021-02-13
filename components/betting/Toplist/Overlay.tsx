import React, { ReactElement, useState, useEffect, useMemo } from "react";
import { BetSeasonToplist } from "@streamdota/shared-types";
import { useAbortFetch } from "../../../hooks/abortFetch";
import { get } from "../../../modules/Network";
import { fetchOverlay } from "../Timer/TimerFrame";
import Toplist from "./Toplist";
import GoogleFontLoader from "react-google-font-loader";
import { useBetStateValue } from "../Context";

interface Props {
    auth: string;
    season: number;
    testing: boolean;
}


const fakeData = [
    {name: 'rmiLEtAnCI', total: 18, won: 16},
    {name: 'rarSeMeNthFFcyCL', total: 16, won: 15},
    {name: 'UrDrIblect', total: 18, won: 15},
    {name: 'DaRNATHRIo', total: 15, won: 14},
    {name: 'IfY', total: 16, won: 14},
    {name: 'thYSmaiNTerahAnd', total: 14, won: 13},
    {name: 'hesPEdenEW', total: 14, won: 12},
    {name: 'hurSTIoNtEareAdU', total: 11, won: 11},
    {name: 'rarSeMeNthEAcyCL', total: 10, won: 10},
    {name: 'rarSeMeTThEAcXL', total: 10, won: 8},
    {name: 'rmiLEXXCI', total: 10, won: 7},
    {name: 'rarSeMYthFFcyCL', total: 10, won: 7},
    {name: 'UrasrIblect', total: 10, won: 7},
    {name: 'DaRNDDRIo', total: 14, won: 6},
    {name: 'IXYCV', total: 5, won: 5},
    {name: 'thYSmaDDDahAnd', total: 5, won: 5},
    {name: 'hesPEAASnEW', total: 8, won: 5},
    {name: 'hurSTIDASareAdU', total: 8, won: 5},
    {name: 'rarSeMeFDcyCL', total: 9, won: 5},
    {name: 'rarSeMeTThEAXYCL', total: 12, won: 5},
]

export async function fetchToplist(abortController: AbortController, key: string, season: number): Promise<BetSeasonToplist[]> {
    return await get<BetSeasonToplist[]>(`/betSeason/toplist/${season}?frameApiKey=${key}`, 'json', {signal: abortController.signal});
}

export default function Overlay({auth, season, testing}: Props): ReactElement | null {
    const [overlay] = useAbortFetch(fetchOverlay, auth);
    const [toplist, reload] = useAbortFetch(fetchToplist, auth, season);
    const [{betRound}] = useBetStateValue();
    useEffect(() => {
        reload();
    }, [betRound]);

    const list = useMemo(() => {
        if(toplist && toplist.length > 0) {
            return toplist;
        }
        return testing ? fakeData : [];

    }, [toplist]);

    if(overlay && toplist) {
        return <>
            {overlay.fontFamily && <GoogleFontLoader fonts={[{font: overlay.fontFamily, weights: [overlay.fontVariant]}]} />}
            <Toplist list={list.slice(0, overlay.toplistMaxEntry)} overlay={overlay} />
            <style jsx global>{`
                body, html {
                    margin: 0;
                    padding: 0;
                    background-color: rgba(0, 0, 0, 0);
                }
            `}</style>
        </>;
    }
    return null;
}