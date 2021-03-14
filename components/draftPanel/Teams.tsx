import { MatchDetails } from "./Panel";
import { ReactElement } from "react";
import TeamHeader from "./TeamHeader";

interface Props {
  matchDetails: MatchDetails;
}

export default function Teams({ matchDetails }: Props): ReactElement {
  return (
    <div className={"teams"}>
      <TeamHeader
        logo={matchDetails?.radiant?.logo || "/images/radiant_icon.png"}
        name={matchDetails?.radiant?.name || "Radiant"}
        twitter={""}
      />
      <TeamHeader
        logo={matchDetails?.dire?.logo || "/images/dire_icon.png"}
        name={matchDetails?.dire?.name || "Dire"}
        twitter={""}
        dire
      />

      <style jsx>{`
        .teams {
          display: flex;
          justify-content: space-between;
          flex: 0;
        }
      `}</style>
    </div>
  );
}
