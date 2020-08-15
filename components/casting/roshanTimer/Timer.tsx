import { ReactElement } from "react";


interface Props {
    remaining: number;
}

export default function Timer({remaining}: Props): ReactElement {
    const minutes = Math.floor(remaining / 60);
    let seconds: number | string = remaining % 60;
    seconds = seconds > 10 ? seconds : '0' + seconds;

    return <div className={'timer'}>
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
            }
        `}</style>
    </div>;
}