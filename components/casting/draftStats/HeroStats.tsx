import { ReactElement } from "react";

interface Props {
  heroClass?: string;
  totalGamesCount?: number;
  matchCount?: number;
  matchWins?: number;
  banCount?: number;
}

export const baseUrl = "https://api.streamdota.com/static/heroes/vids/";

export default function HeroStats({
  matchCount = 0,
  matchWins = 0,
  totalGamesCount = 0,
  banCount = 0,
  heroClass = "zuus",
}: Props): ReactElement {
  const winRate =
    matchCount > 0 ? Math.floor((matchWins * 100) / matchCount) : 0;
  const banRate =
    totalGamesCount > 0
      ? Math.floor(((banCount || 0) * 100) / totalGamesCount)
      : 0;
  const pickRate =
    totalGamesCount > 0 ? Math.floor((matchCount * 100) / totalGamesCount) : 0;

  return (
    <div className={"container"}>
      <div className={"stats"}>
        <div>
          <div className={"value"}>{winRate}%</div>
          <div className={"label"}>WINRATE</div>
          <div className={"subLabel"}>
            {matchWins}/{matchCount} Spiele
          </div>
        </div>
        <div>
          <div className={"value picks"}>{pickRate}%</div>
          <div className={"label"}>PICKS</div>
        </div>
        <div>
          <div className={"value bans"}>{banRate}%</div>
          <div className={"label"}>BANS</div>
        </div>
      </div>

      <div className={"videoContainer"}>
        <video height={"200"} loop autoPlay muted playsInline>
          <source
            src={baseUrl + heroClass + "/300.mov"}
            type="video/quicktime"
          />
          <source src={baseUrl + heroClass + "/300.webm"} type="video/webm" />
        </video>
      </div>

      <style jsx>{`
        .container {
          background-color: #171b1f;
          height: 290px;
          width: 390px;
          display: flex;
          align-items: stretch;
          padding: 1.5rem 2rem;
          box-sizing: border-box;
          justify-content: space-between;
          box-shadow: -5px 5px 15px rgba(0, 0, 0, 0.2);
        }
        .videoContainer {
          display: flex;
          align-items: center;
          margin-left: -2rem;
          max-width: 267px;
        }
        .stats {
          width: 150px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-direction: column;
          font-family: "Arial";
          font-weight: bold;
          font-size: 18pt;
          line-height: 18pt;
          color: #00aefe;
          text-align: center;
          margin-left: -1.5rem;
          padding-right: 1rem;
        }
        .label {
          font-size: 14pt;
          color: #ddd;
          font-weight: normal;
        }
        .bans {
          color: #cc1626;
        }
        .picks {
          color: #51b30f;
        }
        .subLabel {
          font-size: 12pt;
          color: #eee;
          margin-top: -5pt;
        }
      `}</style>
    </div>
  );
}
