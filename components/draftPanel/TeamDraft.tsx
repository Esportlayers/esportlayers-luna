import { TeamDraftData } from "@esportlayers/morphling";
import { ReactElement } from "react";

interface Props {
    draft: TeamDraftData;
}

export const baseUrl = 'https://api.streamdota.com/static/heroes/vids/';

export default function RadiantDraft({draft}: Props): ReactElement {
    console.log(draft);
    return <div className={'draftGrid'}>
        <div className={'container'}>
            <div className={'inner'} />
            {draft?.pick0_id !== 0 && <video key={draft?.pick0_class} height={'150'} loop autoPlay muted playsInline>
                <source src={baseUrl + draft?.pick0_class + '/300.mov'} type="video/quicktime" />
                <source src={baseUrl + draft?.pick0_class + '/300.webm'} type="video/webm" />
            </video>}
        </div>

        <div className={'container'}>
            <div className={'inner'} />
            {draft?.pick1_id !== 0 && <video key={draft?.pick1_class} height={'150'} loop autoPlay muted playsInline>
                <source src={baseUrl + draft?.pick1_class + '/300.mov'} type="video/quicktime" />
                <source src={baseUrl + draft?.pick1_class + '/300.webm'} type="video/webm" />
            </video>}
        </div>

        <div className={'container'}>
            <div className={'inner'} />
            {draft?.pick2_id !== 0 && <video key={draft?.pick2_class} height={'150'} loop autoPlay muted playsInline>
                <source src={baseUrl + draft?.pick2_class + '/300.mov'} type="video/quicktime" />
                <source src={baseUrl + draft?.pick2_class + '/300.webm'} type="video/webm" />
            </video>}
        </div>

        <div className={'container'}>
            <div className={'inner'} />
            {draft?.pick3_id !== 0 && <video key={draft?.pick3_class} height={'150'} loop autoPlay muted playsInline>
                <source src={baseUrl + draft?.pick3_class + '/300.mov'} type="video/quicktime" />
                <source src={baseUrl + draft?.pick3_class + '/300.webm'} type="video/webm" />
            </video>}
        </div>

        <div className={'container'}>
            <div className={'inner'} />
            {draft?.pick4_id !== 0 && <video key={draft?.pick4_class} height={'150'} loop autoPlay muted playsInline>
                <source src={baseUrl + draft?.pick4_class + '/300.mov'} type="video/quicktime" />
                <source src={baseUrl + draft?.pick4_class + '/300.webm'} type="video/webm" />
            </video>}
        </div>

        <style jsx>{`
            .draftGrid {
                display: grid;
                grid-template-columns: .2fr .2fr .2fr .2fr .2fr;
                align-items: stretch;
                grid-gap: .5rem;
            }    

            .container {
                position: relative;
            }

            .inner {
                position: absolute;
                top: 4vh;
                bottom: 4vh;
                left: 3.5vh;
                right: 3.5vh;
                background-color: rgba(0,0,0,0.3);
            }

            video {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                top: 0;
                z-index: 2;
            }
        `}</style>
    </div>
}