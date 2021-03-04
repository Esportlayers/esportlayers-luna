import {
  PlayerCompareGraphValue,
  StatsOverlayMessages,
} from "@esportlayers/io";

import { ReactElement } from "react";
import { formatNumber } from "accounting";

interface Props {
  data: PlayerCompareGraphValue;
}

export const typeNameMap = {
  gpm: "GPM",
  xpm: "XPM",
  hero_damage: "Hero Damage",
  runes_activated: "Rune Pickups",
  camps_stacked: "Camps Stacked",
  support_gold_spent: "Support Gold Spent",
};

export const iconNameMap = {
  gpm: "GPM.svg",
  xpm: "XPM.svg",
  hero_damage: "hero_dmg.svg",
  runes_activated: "runes.svg",
  camps_stacked: "camps.svg",
  support_gold_spent: "support_gold.svg",
};

const exampleData: PlayerCompareGraphValue = {
  type: StatsOverlayMessages.playerCompareGraph,
  dataType: "hero_damage",
  data: [
    {
      absolute: 12854,
      percentage: 90,
    },
    {
      absolute: 9012,
      percentage: 70,
    },
    {
      absolute: 7299,
      percentage: 60,
    },
    {
      absolute: 12854,
      percentage: 90,
    },
    {
      absolute: 5012,
      percentage: 40,
    },
    {
      absolute: 7299,
      percentage: 60,
    },
    {
      absolute: 12854,
      percentage: 90,
    },
    {
      absolute: 12023,
      percentage: 87,
    },
    {
      absolute: 9012,
      percentage: 70,
    },
    {
      absolute: 5012,
      percentage: 40,
    },
  ],
};

export default function OverlayStats({
  data = exampleData,
}: Props): ReactElement {
  const statsData = data || exampleData;
  return (
    <div className={"container"}>
      <div className={"dropdownGrid"}>
        {statsData.data.slice(0, 5).map(({ absolute, percentage }, idx) => (
          <div key={idx} className={"valueContainer"}>
            <div className={"progressContainer"}>
              <div className={"value"} style={{ height: percentage + "%" }} />
            </div>
            <div className={"label"}>{formatNumber(absolute, 0, " ")}</div>
          </div>
        ))}
        <div className={"typeBox"}>
          <div className={"icon"}>
            <img
              src={"/images/icons/" + iconNameMap[statsData?.dataType]}
              alt={statsData?.dataType}
            />
          </div>
          <div className={"typeLabel"}>{typeNameMap[statsData?.dataType]}</div>
        </div>
        {statsData.data.slice(5, 10).map(({ absolute, percentage }, idx) => (
          <div key={idx} className={"valueContainer"}>
            <div className={"progressContainer"}>
              <div className={"value"} style={{ height: percentage + "%" }} />
            </div>
            <div className={"label"}>{formatNumber(absolute, 0, " ")}</div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .container {
          height: 1080px;
          width: 1920px;
          padding-top: 85px;
          box-sizing: border-box;
        }

        .dropdownGrid {
          width: 44vw;
          background-color: #fff;
          height: 200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(5, 1fr) 200px repeat(5, 1fr);
          box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.5);
        }

        .valueContainer {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          padding: 1rem 0;
          box-sizing: border-box;
        }

        .label {
          color: #444;
          font-size: 14px;
          font-weight: bold;
          margin-top: 0.5rem;
        }

        .progressContainer {
          flex-grow: 1;
          width: 1rem;
          background-color: #ededed;
          position: relative;
        }

        .value {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #00aefe;
          box-shadow: 0 0 5px rgba(0, 174, 254, 0.5);
        }

        .typeBox {
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          box-sizing: border-box;
          padding: 1rem;
          overflow: hidden;
        }

        .icon {
          flex: 1;
          overflow: hidden;
          height: 100%;
          width: 100%;
          padding: 1rem;
          box-sizing: border-box;
          text-align: center;
        }

        .icon img {
          max-height: 100%;
          height: auto;
          object-fit: contain;
        }

        .typeLabel {
          font-size: 16px;
          font-weight: bold;
          flex: 0;
          margin-top: 1rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
