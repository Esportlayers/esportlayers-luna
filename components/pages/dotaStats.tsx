import Overlay, { fetchUser } from "../dotaStats/Overlay";
import Tether, { EventTypes } from "@esportlayers/io";

import { ReactElement } from "react";
import getWebsocketUrl from "../../modules/Router";
import { useAbortFetch } from "../../hooks/abortFetch";

export default function DotaStatsPage({
  auth,
  dynamicNumbers,
  testing,
}: {
  auth: string;
  dynamicNumbers: boolean;
  testing: boolean;
}): ReactElement {
  const [user] = useAbortFetch(fetchUser, auth);
  if (user && Boolean(user.useDotaStatsOverlay)) {
    return (
      <Tether
        url={getWebsocketUrl() + "/live/scoped/" + auth}
        scopes={[
          EventTypes.gsi_game_winner,
          EventTypes.gsi_connected,
          EventTypes.gsi_game_state,
          EventTypes.gsi_game_activity,
          EventTypes.overlay,
          EventTypes.dota_wl_reset,
        ]}
      >
        <Overlay
          frameKey={auth}
          testing={testing}
          dynamicNumbers={dynamicNumbers}
        />

        <style global jsx>{`
          html,
          body {
            height: 60px !important;
            width: 160px !important;
            background-color: transparent;
          }
        `}</style>
      </Tether>
    );
  }
  return null;
}
