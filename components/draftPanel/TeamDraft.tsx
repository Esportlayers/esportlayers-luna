import { ReactElement } from "react";
import { TeamDraftData } from "@esportlayers/morphling";

interface Props {
  draft: TeamDraftData;
}

export const baseUrl = "https://api.streamdota.com/static/heroes/vids/";

const keys = [
  "pick0_class",
  "pick1_class",
  "pick2_class",
  "pick3_class",
  "pick4_class",
];

export default function TeamDraft({ draft }: Props): ReactElement {
  return (
    <div className={"draftGrid"}>
      {keys.map((key) => (
        <div className={"container"} key={key}>
          <div className={"inner"} />
          {draft && draft[key] !== 0 && (
            <video
              key={draft[key]}
              height={"150"}
              loop
              autoPlay
              muted
              playsInline
            >
              <source
                src={baseUrl + draft[key] + "/300.mov"}
                type="video/quicktime"
              />
              <source
                src={baseUrl + draft[key] + "/300.webm"}
                type="video/webm"
              />
            </video>
          )}
          <div className={"pedestal"} />
        </div>
      ))}

      <style jsx>{`
        .draftGrid {
          display: grid;
          grid-template-columns: 0.2fr 0.2fr 0.2fr 0.2fr 0.2fr;
          align-items: stretch;
          grid-gap: 0.5rem;
        }

        .container {
          position: relative;
        }

        .inner {
          position: absolute;
          top: 4vh;
          bottom: 4vh;
          left: 3.5vh;
          right: 3.5vh;
        }

        video {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: -20px;
          z-index: 2;
        }

        .pedestal {
          position: absolute;
          bottom: -0.8rem;
          left: 0.5rem;
          right: 0.5rem;
          height: 1rem;
          background-color: #4c4c4c;
        }
      `}</style>
    </div>
  );
}
