import Draft from "../draftPanel/Draft";
import { ReactElement } from "react";
import Tether from "@esportlayers/io";
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
      <Tether url={getWebsocketUrl() + "/dota-gsi/live/" + auth}>
        <div className={"draftPanel"}>
          <div className={"teams"}>
            <div>Team Radiant</div>
            <div>Team Dire</div>
          </div>

          <div className={"draftGrid"}>
            <Draft />
          </div>
        </div>

        <style jsx>{`
                .draftPanel {
                    position: fixed;
                    bottom 5vh;
                    width: 94vw;
                    height: 40vh;
                    background: radial-gradient(50% 839.4% at 50% 50%, #5C5C5C 0%, #8F8F8F 100%);
                    padding: 1rem 2rem;
                    margin: 0 3vw;
                }    

                .teams {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 20px;
                    line-height: 20px;
                    text-transform: uppercase;
                    color: #FFF;
                    font-weight: bold;
                    font-family: Arial;
                }

                .draftGrid {
                    display: grid;
                    grid-template-columns: 1fr 25vh 1fr;
                    height: 30vh;
                    margin-top: 3vh;
                }
            `}</style>

        <style jsx global>{`
          body,
          html {
            padding: 0;
            margin: 0;
          }
          * {
            box-sizing: border-box;
          }
        `}</style>
      </Tether>
    );
  }

  return null;
}
