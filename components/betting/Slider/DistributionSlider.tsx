import { ReactElement } from "react";
import { BetOverlay } from "@streamdota/shared-types";
import GoogleFontLoader from "react-google-font-loader";
import { getVariant } from "../../dotaStats/DotaOverlayFrame";
import classNames from "classnames";

interface Props {
    overlay: BetOverlay;
    distribution?: number;
    delay: number;
    aBets?: number;
    bBets?:number;
    teamA?: string;
    teamB?: string;
    command?: string;
}

export default function DistributionSlider({overlay, distribution = 50, delay, aBets = 0, bBets = 0, teamA = 'a', teamB = 'b', command = '!bet'}: Props): ReactElement {
    return <>
        {overlay.fontFamily && <GoogleFontLoader fonts={[{font: overlay.fontFamily, weights: [overlay.fontVariant]}]} />}

        <div className={'distributionSlider'}>
            <div className={'vote votaA'} style={{...getVariant(overlay.fontVariant)}}>
                {command} {teamA}
            </div>
            <div className={classNames('distributionWrapper', {delay})}>
                <div className={'slider'}>
                    <div className={'progress'} style={{width: distribution + '%'}}/>
                </div>

                {Boolean(overlay.distributionNumbers) && <div className={'numberWrapper'}>
                    <div className={'numbers'} style={{...getVariant(overlay.fontVariant)}}>
                        <div className={'num'} style={{...getVariant(overlay.fontVariant)}}>{aBets}</div><div className={'divider'}>|</div><div className={'num'}  style={{...getVariant(overlay.fontVariant)}}>{bBets}</div>
                    </div>
                </div>}
            </div>
            <div className={'vote votaB'} style={{...getVariant(overlay.fontVariant)}}>
                {command} {teamB}
            </div>
        </div>

        <style jsx>{`
            .distributionSlider {
                display: flex;
                align-items: flex-start;
            }

            .vote {
                background-color: ${overlay.distributionBackground};
                color: ${overlay.distributionFont};
                padding: .5em .75em;
                font-size: ${overlay.distributionFontSize}px;
                flex-shrink: 0;
                line-height: 1em;
                font-family: ${overlay.fontFamily};
                text-transform: uppercase;
            }

            .slider {
                width: 100%;
                border-radius: 8px;
                height: 12px;
                background-color: ${overlay.distributionColorRight};
            }

            .distributionWrapper {
                padding-top: 1.3em;
                display: flex;
                flex-direction: column;
                align-items: stretch;
                width: 100%;
                flex-grow: 1;
                margin: 0 20px;
            }

            .numberWrapper {
                margin: 0 auto;
            }

            .numbers {
                align-items: center;
                justify-content: space-around;
                background-color: ${overlay.distributionBackground};
                color: ${overlay.distributionFont};
                padding: .5em .75em;
                font-size: ${overlay.distributionFontSize}px;
                line-height: 1em;
                text-transform: uppercase;
                margin-top: 10px;
                display: inline-flex;
            }

            .divider {
                margin: -1px 10px 0 10px;
            }

            .num {
                line-height: 1em;
                font-family: ${overlay.fontFamily};
            }

            .delay {
                visibility: hidden;
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