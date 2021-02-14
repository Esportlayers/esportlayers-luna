import { EventTypes, GsiDraftMessage, useTetherMessageListener } from "@esportlayers/io";
import { ReactElement } from "react";
import TeamDraft from "./TeamDraft";


export default function Draft(): ReactElement | null {
    const {value: draft} = useTetherMessageListener<GsiDraftMessage>(EventTypes.gsi_draft) || {value: null};

    if(draft) {
        return <>
            <TeamDraft draft={draft.team2} />
            <div>Info</div>
            <TeamDraft draft={draft.team3} />
        </>
    }

    return null;
}