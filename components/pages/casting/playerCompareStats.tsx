import Tether, { EventTypes } from "@esportlayers/io";

import Overlay from "../../casting/playerCompareStats/Overlay";
import { ReactElement } from "react";
import { fetchUser } from "../../dotaStats/Overlay";
import getWebsocketUrl from "../../../modules/Router";
import { useAbortFetch } from "../../../hooks/abortFetch";

interface Props {
  auth: string;
  testing: boolean;
}

export default function HeroStatsPage({ auth, testing }: Props): ReactElement {
  const [user] = useAbortFetch(fetchUser, auth);
  if (user && Boolean(user.useHeroStatsOverlay)) {
    return (
      <Tether
        url={getWebsocketUrl() + "/live/scoped/" + auth}
        scopes={[EventTypes.statsoverlay]}
      >
        <Overlay testing={testing} />

        <style global jsx>{`
          html,
          body {
            background-color: transparent;
            font-family: Arial;
            padding: 0;
            margin: 0;
          }
        `}</style>
      </Tether>
    );
  }

  return null;
}
