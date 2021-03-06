import Tether, { EventTypes } from "@esportlayers/io";

import Ban from "../draftPanel/Ban";
import Draft from "../draftPanel/Draft";
import Head from "next/head";
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
          scopes={[EventTypes.gsi_draft]}
        >
          <div className={"draftPanel"}>
            <div className={"teams"}>
              <TeamHeader
                logo={
                  "https://pro.eslgaming.com/imgcache/prodb/teamlogos/374/374ad02f-2ad8-401f-bf14-806db527c9e3-ivy.png"
                }
                name={"IVY"}
                twitter={"@weareivygg"}
              />
              <TeamHeader
                logo={
                  "https://pro.eslgaming.com/imgcache/prodb/teamlogos/f10/f1096b11-ad0e-48e7-a296-da20e52a35c1-tt-willhaben.png"
                }
                name={"TT WILLHABEN"}
                twitter={"@TT_willhaben"}
                dire
              />
            </div>

            <div className={"draftGrid"}>
              <Draft />
            </div>

            <div className={"banGrid"}>
              <Ban />
            </div>
          </div>
        </Tether>

        <style jsx>{`
          .draftPanel {
            margin: auto 5rem 5rem 5rem;
            width: calc(100% - 10rem);
            height: 20rem;
            background: #fff;
            box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.5);
            padding: 1rem 2rem;
            display: flex;
            flex-direction: column;
            align-items: stretch;
          }

          .teams {
            display: flex;
            justify-content: space-between;
            flex: 0;
          }

          .draftGrid,
          .banGrid {
            display: grid;
            flex: 1;
            grid-template-columns: 0.5fr 22rem 0.5fr;
            padding: 2rem 0;
          }

          .banGrid {
            flex: 0;
            padding: 0;
          }
        `}</style>

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
