import Overlay from "../../casting/playerCompareStats/Overlay";
import { ReactElement } from "react";
import Tether from "@esportlayers/io";
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
      <Tether url={getWebsocketUrl() + "/dota-gsi/live/" + auth}>
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
