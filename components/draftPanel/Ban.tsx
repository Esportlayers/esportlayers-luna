import {
  EventTypes,
  GsiDraftMessage,
  useTetherMessageListener,
} from "@esportlayers/io";

import { ReactElement } from "react";
import TeamBan from "./TeamBan";

export default function Ban(): ReactElement | null {
  const { value: draft } = useTetherMessageListener<GsiDraftMessage>(
    EventTypes.gsi_draft
  ) || { value: null };

  if (draft) {
    return (
      <>
        <TeamBan draft={draft.team2} />
        <div />
        <TeamBan draft={draft.team3} />
      </>
    );
  }

  return null;
}
