import Overlay from "../antiSnipe/Overlay";
import { ReactElement } from "react";
import Tether from "@esportlayers/io";
import { fetchUser } from "../dotaStats/Overlay";
import getWebsocketUrl from "../../modules/Router";
import { useAbortFetch } from "../../hooks/abortFetch";

export default function AntiSnipePage({
  auth,
  testing,
}: {
  auth: string;
  testing: boolean;
}): ReactElement {
  const [user] = useAbortFetch(fetchUser, auth);
  if (user && Boolean(user.useMinimapOverlay)) {
    return (
      <Tether url={getWebsocketUrl() + "/dota-gsi/live/" + auth}>
        <div className={"antiSnipe"}>
          <Overlay frameKey={auth} testing={testing} />
        </div>

        <style global jsx>{`
          html,
          body {
            padding-bottom: 3px;
            background-color: transparent;
            margin: 0;
          }

          .antiSnipe {
            width: 243px;
            height: 243px;
          }
        `}</style>
      </Tether>
    );
  }

  return null;
}
