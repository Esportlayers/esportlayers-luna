import Overlay from "../keywordListener/Overlay";
import { ReactElement } from "react";
import Tether from "@esportlayers/io";
import { fetchUser } from "../antiSnipe/Overlay";
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
  if (user) {
    return (
      <Tether url={getWebsocketUrl() + "/dota-gsi/live/" + auth}>
        <Overlay testing={testing} />

        <style global jsx>{`
          html,
          body {
            padding: 0;
            margin: 0;
            display: flex;
            align-items: flex-end;
            height: 100vh;
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
