import Tether, { EventTypes } from "@esportlayers/io";

import Overlay from "../../casting/draftStats/Overlay";
import { ReactElement } from "react";
import { fetchUser } from "../../dotaStats/Overlay";
import getWebsocketUrl from "../../../modules/Router";
import { useAbortFetch } from "../../../hooks/abortFetch";

interface Props {
  auth: string;
  testing: boolean;
}

export default function DraftStatsPage({ auth, testing }: Props): ReactElement {
  const [user] = useAbortFetch(fetchUser, auth);
  if (user && Boolean(user.useDraftStatsOverlay)) {
    return (
      <Tether
        url={getWebsocketUrl() + "/live/scoped/" + auth}
        scopes={[EventTypes.statsoverlay]}
      >
        <Overlay testing={testing} />

        <style global jsx>{`
          html,
          body {
            height: calc(100% + 5rem);
            background-color: transparent;
            font-family: Arial;
            padding: 5px 0;
            margin: 0;
            display: flex;
            justify-content: flex-end;
            font-size: 28px;
            max-width: 100%;
            overflow: hidden;
            width: 100%;
          }
        `}</style>
      </Tether>
    );
  }
  return null;
}
