import { ReactElement } from "react";
import {formatNumber} from 'accounting';

interface Props {
    data: Array<{absolute: number; percentage: number}>;
}

export default function ValueBars({data}: Props): ReactElement {

    return <>
        {data.map(({absolute, percentage}, idx) => <div className={'bar bar-' + idx} key={idx}>
            <div className={'progress'} style={{height: percentage + '%'}} />
            <div className={'absoluteValue'}>{formatNumber(absolute, 0, ' ')}</div>
        </div>)}

        <style jsx>{`
            .bar {
                position: absolute;
                height: 119px;
                width: 11px;
                top: 110px;
            }

            .bar-0 {
                left: 569px;
            }

            .bar-1 {
                left: 633px;
            }

            .bar-2 {
                left: 696px;
            }

            .bar-3 {
                left: 760px;
            }

            .bar-4 {
                left: 820px;
            }

            .bar-9 {
                right: 571px;
            }

            .bar-8 {
                right: 631px;
            }

            .bar-7 {
                right: 695px;
            }

            .bar-6 {
                right: 758px;
            }

            .bar-5 {
                right: 822px;
            }

            .absoluteValue {
                color: #FFF;
                font-weight: bold;
                top: -27px;
                text-align: center;
                margin-left: -24px;
                width: 60px;
                position: absolute;
                font-size: 13px;
                text-shadow: 1px 1px  #000;
            }

            .progress {
                background-color: #FF9900;
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                max-height: 150px;
                box-shadow: 0 0 10px 0 #FF9900;
                transition: height 240ms ease-in-out;
                height: 0;
            }
        `}</style>
    </>;
}