import HeroAvatar from "./HeroAvatar";
import { ReactElement } from "react";
import { TeamDraftData } from "@esportlayers/morphling";

interface Props {
  draft: TeamDraftData;
}

export const baseUrl = "https://api.streamdota.com/static/heroes/vids/";

const keys = [
  "ban0_class",
  "ban1_class",
  "ban2_class",
  "ban3_class",
  "ban4_class",
  "ban5_class",
  "ban6_class",
];

export default function TeamBan({ draft }: Props): ReactElement {
  return (
    <div className={"banGrid"}>
      {keys.map((key) => (
        <div className={"entry"} key={key}>
          {draft && draft[key] !== 0 && draft[key].length > 0 && (
            <HeroAvatar heroClass={draft[key]} prefix={"h"} />
          )}
        </div>
      ))}

      <style jsx>{`
        .banGrid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          align-items: stretch;
          grid-gap: 1rem;
          padding: 0 0.5rem;
        }

        .entry {
          overflow: hidden;
          height: 100%;
          width: 100%;
          border: 1px solid rgba(0, 0, 0, 0.2);
          box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
          filter: grayscale(0.5);
          min-height: 52px;
        }
      `}</style>
    </div>
  );
}
