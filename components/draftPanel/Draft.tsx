import {
  EventTypes,
  GsiDraftMessage,
  useTetherMessageListener,
} from "@esportlayers/io";

import DraftInfo from "./DraftInfo";
import { MatchDetails } from "./Panel";
import { ReactElement } from "react";
import TeamDraft from "./TeamDraft";

interface Props {
  matchDetails: MatchDetails;
}

export default function Draft({ matchDetails }: Props): ReactElement | null {
  const { value: draft } = useTetherMessageListener<GsiDraftMessage>(
    EventTypes.gsi_draft
  ) || { value: null };

  if (draft) {
    return (
      <>
        <TeamDraft draft={draft.team2} />
        <DraftInfo matchDetails={matchDetails} />
        <TeamDraft draft={draft.team3} />
      </>
    );
  }

  return null;
}
