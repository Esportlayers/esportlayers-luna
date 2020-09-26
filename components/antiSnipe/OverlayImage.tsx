import { AntiSnipeOverlay } from "@streamdota/shared-types";
import { ReactElement } from "react";
import { useAbortFetch } from "../../hooks/abortFetch";
import { get } from "../../modules/Network";


export async function fetchRoshOverlay(abortController: AbortController, key: string): Promise<AntiSnipeOverlay> {
    return await get<AntiSnipeOverlay>('/antiSnipe?frameApiKey=' + key, 'json', {signal: abortController.signal});
}

export default function OverlayImage({frameApiKey}: {frameApiKey: string}): ReactElement | null {
    const [cfg] = useAbortFetch(fetchRoshOverlay, frameApiKey);

    if(cfg) {
        return <>
            {cfg.type === 'normal' && <img className={'overlay'} src={'/images/minimap_full.png'} style={{opacity: cfg.opacity + '%'}} />}
            {cfg.type === 'rounded' && <img className={'overlay'} src={'/images/minimap_rounded.png'} style={{opacity: cfg.opacity + '%'}}/>}
        </>;
    }
    return null;
}