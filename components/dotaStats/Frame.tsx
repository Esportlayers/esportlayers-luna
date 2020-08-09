import { ReactElement, ReactNode } from "react";
import GoogleFontLoader from 'react-google-font-loader';
import { useAbortFetch } from "../../hooks/abortFetch";
import { get } from "../../modules/Network";
import { OverlayConfig } from "@streamdota/shared-types";

export function getVariant(variant: string): React.CSSProperties {
    return {
        //@ts-ignore
        fontWeight: variant.substring(0, 3), 
        fontStyle: variant.includes('italic') ? 'italic' : 'initial'
    };
}

function Number({color, x, y, height, cfg, children}: {color: string, x: number, y:number, height: string, cfg: OverlayConfig, children: ReactNode}): ReactElement {
    return <div style={{
        color, 
        display: 'inline', 
        position: 'absolute', 
        top: y + 'px',
        left: x + 'px',
        fontSize: cfg.fontSize + 'px',
        lineHeight: height,
        fontFamily: cfg.font,
        ...getVariant(cfg.variant),
    }}>{children}</div>
}

export async function fetchOverlay(abortController: AbortController, key: string): Promise<OverlayConfig> {
    return await get<OverlayConfig>('/overlay?frameApiKey=' + key, 'json', {signal: abortController.signal});
}


export default function Frame({wins, loss, auth}: {wins: number; loss: number; auth: string}): ReactElement | null  {
    const [cfg] = useAbortFetch(fetchOverlay, auth);

    if(cfg) {
        return <>
            {cfg.font && cfg.font !== 'Arial' && <GoogleFontLoader fonts={[{font: cfg.font, weights: [cfg.variant]}]} />}
            <div className={'positionFrame ' + (!cfg.showBackground && 'noBg')}>
                <div className={'container'}>
                    <Number color={cfg.winColor} cfg={cfg} x={cfg.winX} y={cfg.winY} height={'.9em'}>{wins}</Number>
                    <Number color={cfg.dividerColor} cfg={cfg} x={cfg.dividerX} y={cfg.dividerY} height={'.7em'}>:</Number>
                    <Number color={cfg.lossColor} cfg={cfg} x={cfg.lossX} y={cfg.lossY} height={'.9em'}>{loss}</Number>
                </div>
            </div>
            <style jsx>{`
                .positionFrame {
                    width: 160px;
                    background-image: url('/images/w-l-background.png');
                    background-size: cover;
                    height: 60px;
                }

                .noBg {
                    background: none;
                }

                .container {
                    height: 58px;
                    position: relative;
                }
            `}</style>
        </>;
    }

    return null;
}
