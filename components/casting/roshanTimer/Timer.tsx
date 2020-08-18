import { ReactElement } from "react";
import { RoshOverlay } from "@streamdota/shared-types";
import { get } from "../../../modules/Network";
import { useAbortFetch } from "../../../hooks/abortFetch";
import classNames from "classnames";
import GoogleFontLoader from 'react-google-font-loader';


interface Props {
    remaining: number;
    auth: string;
    state: 'alive' | 'respawn_base' | 'respawn_variable';
}



export async function fetchRoshOverlay(abortController: AbortController, key: string): Promise<RoshOverlay> {
    return await get<RoshOverlay>('/roshTimer?frameApiKey=' + key, 'json', {signal: abortController.signal});
}

export default function Timer({auth, remaining, state}: Props): ReactElement {
    const [cfg] = useAbortFetch(fetchRoshOverlay, auth);

    const minutes = Math.floor(remaining / 60);
    let seconds: number | string = remaining % 60;
    seconds = seconds > 10 ? seconds : '0' + seconds;

    return <div className={classNames('timer', {state})}>
        {cfg.font && cfg.font !== 'Arial' && <GoogleFontLoader fonts={[{font: cfg.font, weights: [cfg.variant]}]} />}
        {minutes}:{seconds}

        <style jsx global>{`
            body, html {
                margin: 0;
                padding: 0;
            }
        `}</style>

        <style jsx>{`
            .timer {
                height: 100vh;
                width: 100vw;
                line-height: 1em;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Arial';
                color: #FFF;
                background-image: url('/images/rosh_timer_bg.png');
                background-repeat: no-repeat;
                background-size: cover;
                font-family: ${cfg.font};
                font-size: ${cfg.fontSize}px;
                color: #FFF;
            }

            .respawn_base {
                color: ${cfg.baseColor};
            }

            .respawn_variable {
                color: ${cfg.variableColor};
            }
        `}</style>
    </div>;
}