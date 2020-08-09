import { ReactElement } from "react";
import { BetOverlay } from "@streamdota/shared-types";
import GoogleFontLoader from "react-google-font-loader";

interface Props {
    overlay: BetOverlay;
    distribution?: number;
}

export default function DistributionSlider({overlay, distribution = 50}: Props): ReactElement {
    return <>
        {overlay.fontFamily && <GoogleFontLoader fonts={[{font: overlay.fontFamily, weights: [overlay.fontVariant]}]} />}

        <div className={'distributionSlider'}>
            <div className={'vote votaA'}>
                !bet a
            </div>
            <div className={'slider'}>
                <div className={'progress'} style={{width: distribution + '%'}}/>
            </div>
            <div className={'vote votaB'}>
                !bet b
            </div>
        </div>

        <style jsx>{`
            .distributionSlider {
                display: flex;
                align-items: center;
            }

            .vote {
                background-color: ${overlay.distributionBackground};
                color: ${overlay.distributionFont};
                padding: .5em .75em;
                font-size: ${overlay.distributionFontSize}px;
                flex-shrink: 0;
                line-height: 1em;
                font-family: ${overlay.fontFamily};
            }

            .slider {
                flex-grow: 1;
                width: 100%;
                margin: 0 20px;
                border-radius: 8px;
                height: 12px;
                background-color: ${overlay.distributionColorRight};
            }

            .progress {
                background-color: ${overlay.distributionColorLeft};
                position: relative;
                height: 100%;
                transition: width 120ms ease-in-out;
                min-width: 10px;
                max-width: calc(100% - 10px);
                border-top-left-radius: 8px;
                border-bottom-left-radius: 8px;
            }

            .progress:after {
                content: ' ';
                position: absolute;
                top: -2px;
                bottom: -2px;
                width: 4px;
                right: -2px;
                background-color: #000;
                border-radius: 2px;
                height: calc(100% + 4px);
            }
        `}</style>
    </>;
}