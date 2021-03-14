import Tether, { EventTypes } from "@esportlayers/io";

import Overlay from "../keywordListener/Overlay";
import { ReactElement } from "react";
import { fetchUser } from "../dotaStats/Overlay";
import getWebsocketUrl from "../../modules/Router";
import { useAbortFetch } from "../../hooks/abortFetch";

export default function KeyWordListener({
  auth,
  testing,
}: {
  auth: string;
  testing: boolean;
}): ReactElement {
  const [user] = useAbortFetch(fetchUser, auth);
  if (Boolean(user?.useKeywordListenerOverlay)) {
    return (
      <Tether
        url={getWebsocketUrl() + "/live/scoped/" + auth}
        scopes={[EventTypes.keyword_message_overlay]}
      >
        <Overlay testing={testing} />

        <style global jsx>{`
          html,
          body {
            padding: 0;
            margin: 0;
            display: flex;
            align-items: flex-end;
            height: 100vh;
            overflow: hidden;
          }

          * {
            box-sizing: border-box;
            font-family: Arial;
          }
        `}</style>
      </Tether>
    );
  }
  return null;
}
