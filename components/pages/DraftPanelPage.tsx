import Tether, { EventTypes } from "@esportlayers/io";

import Ban from "../draftPanel/Ban";
import Draft from "../draftPanel/Draft";
import Head from "next/head";
import Panel from "../draftPanel/Panel";
import { ReactElement } from "react";
import TeamHeader from "../draftPanel/TeamHeader";
import { fetchUser } from "../dotaStats/Overlay";
import getWebsocketUrl from "../../modules/Router";
import { useAbortFetch } from "../../hooks/abortFetch";

interface Props {
  auth: string;
}

export default function DraftPanelPage({ auth }: Props): ReactElement {
  const [user] = useAbortFetch(fetchUser, auth);

  if (user) {
    return (
      <>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <Tether
          url={getWebsocketUrl() + "/live/scoped/" + auth}
          scopes={[
            EventTypes.gsi_draft,
            EventTypes.gsi_match_id,
            EventTypes.gsi_game_state,
          ]}
        >
          <Panel apiKey={auth} />
        </Tether>

        <style jsx global>{`
          body,
          html {
            padding: 0;
            margin: 0;
            height: 1080px;
            width: 1920px;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: flex-end;
          }
          * {
            box-sizing: border-box;
          }
        `}</style>
      </>
    );
  }

  return null;
}
