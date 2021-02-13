import { ReactElement, ReactNode } from "react";
import GoogleFontLoader from 'react-google-font-loader';
import { useAbortFetch } from "../../hooks/abortFetch";
import { get } from "../../modules/Network";
import { OverlayConfig } from "@streamdota/shared-types";

export function getVariant(variant?: string): React.CSSProperties {
    if(variant) {
        return {
            //@ts-ignore
            fontWeight: variant.substring(0, 3), 
            fontStyle: variant.includes('italic') ? 'italic' : 'initial'
        };
    }
    return {};
}

function Number({color, cfg, children, right}: {color: string, cfg: OverlayConfig, children: ReactNode, right?: boolean}): ReactElement {
    return <div style={{
        color, 
        display: 'inline', 
        position: 'absolute', 
        top: '52%',
        left: right ? '22%' : 'auto',
        right: right ? 'auto' : '21%',
        fontSize: '2vw',
        fontFamily: cfg.font,
        transform: 'translateY(-50%)',
        ...getVariant(cfg.variant),
    }}>{children}</div>
}

export async function fetchDotaOverlay(abortController: AbortController, key: string): Promise<OverlayConfig> {
    return await get<OverlayConfig>('/overlay?frameApiKey=' + key, 'json', {signal: abortController.signal});
}


export default function DotaOverlayFrame({wins, loss, auth}: {wins: number; loss: number; auth: string}): ReactElement | null  {
    const [cfg] = useAbortFetch(fetchDotaOverlay, auth);

    if(cfg) {
        return <>
            {cfg.font && cfg.font !== 'Arial' && <GoogleFontLoader fonts={[{font: cfg.font, weights: [cfg.variant]}]} />}
            <div className={'positionFrame ' + (!cfg.showBackground && 'noBg')}>
                <div className={'container'}>
                    <Number color={cfg.winColor} cfg={cfg}>{wins}</Number>
                    <Number color={cfg.lossColor} cfg={cfg} right>{loss}</Number>
                </div>
            </div>
            <style jsx global>{`
                body, html {
                    margin: 0;
                    padding: 0;
                }
            `}</style>
            <style jsx>{`
                .positionFrame {
                    padding-bottom: 37.5%;
                    position: relative;
                }

                .noBg {
                    background: none;
                }

                .container {
                    background-image: url('/images/w-l-background.png');
                    background-size: cover;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                }
            `}</style>
        </>;
    }

    return null;
}
