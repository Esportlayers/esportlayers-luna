import { ReactElement } from "react";
import ToplistFrame from "../../betting/Toplist/ToplistFrame";
import { Wisp } from "@esportlayers/io";
import { fetchUser } from "../../dotaStats/Overlay";
import getWebsocketUrl from "../../../modules/Router";
import { useAbortFetch } from "../../../hooks/abortFetch";

export default function ToplistPage({
  auth,
  testing,
}: {
  auth: string;
  testing: boolean;
}): ReactElement {
  const [user] = useAbortFetch(fetchUser, auth);
  if (user && Boolean(user.useVoteToplistOverlay)) {
    return (
      <Wisp url={getWebsocketUrl() + "/bets/live/" + auth}>
        <ToplistFrame auth={auth} testing={testing} />
      </Wisp>
    );
  }

  return null;
}
