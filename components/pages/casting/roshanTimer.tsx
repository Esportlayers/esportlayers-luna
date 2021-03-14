import Tether, { EventTypes } from "@esportlayers/io";

import Overlay from "../../casting/roshanTimer/Overlay";
import { ReactElement } from "react";
import { fetchUser } from "../../dotaStats/Overlay";
import getWebsocketUrl from "../../../modules/Router";
import { useAbortFetch } from "../../../hooks/abortFetch";

interface Props {
  auth: string;
  testing: boolean;
}

export default function RoshanTimerPage({
  auth,
  testing,
}: Props): ReactElement {
  const [user] = useAbortFetch(fetchUser, auth);
  if (user && Boolean(user.useMinimapOverlay)) {
    return (
      <Tether
        url={getWebsocketUrl() + "/live/scoped/" + auth}
        scopes={[
          EventTypes.gsi_roshan,
          EventTypes.gsi_game_winner,
          EventTypes.gsi_game_state,
          EventTypes.overlay,
        ]}
      >
        <Overlay testing={testing} auth={auth} />

        <style global jsx>{`
          html,
          body {
            height: 60px !important;
            background-color: transparent;
          }
        `}</style>
      </Tether>
    );
  }
  return null;
}
