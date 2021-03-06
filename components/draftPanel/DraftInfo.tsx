import {
  EventTypes,
  GsiDraftMessage,
  useTetherMessageListener,
} from "@esportlayers/io";

import { ReactElement } from "react";
import classNames from "classnames";

function toReadableTime(time: number): string {
  const minutes = Math.floor(time / 60);
  let seconds: number | string = time % 60;
  seconds = seconds >= 10 ? seconds : "0" + seconds;

  return `${minutes}:${seconds}`;
}

export default function DraftInfo(): ReactElement {
  const { value: draft } = useTetherMessageListener<GsiDraftMessage>(
    EventTypes.gsi_draft
  ) || { value: null };

  console.log(draft);
  if (draft) {
    const isRadiantTurn = draft.activeteam === 2;
    const reserveTime = isRadiantTurn
      ? draft.radiant_bonus_time
      : draft.dire_bonus_time;

    return (
      <div className={"info"}>
        <div className={"teamRadiantStats"}>1</div>
        <div className={"teamDireStats"}>0</div>

        <div className={"headerStats"}>
          <div className={"type"}>Best of 3</div>
          <div className={"stats"}>Game 2</div>
        </div>

        <div
          className={classNames("draftState", {
            isRadiantTurn,
            isDireTurn: !isRadiantTurn,
            reserveTimeActive: draft.activeteam_time_remaining === 0,
          })}
        >
          <svg
            className={"radiantPickIndictator"}
            width={"1.5rem"}
            viewBox="0 0 169 298"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M169 20.338V277.662C169 295.48 147.457 304.403 134.858 291.804L6.196 163.142C-1.614 155.332 -1.614 142.668 6.196 134.858L134.858 6.19601C147.457 -6.40399 169 2.52001 169 20.338Z"
              fill="currentColor"
            />
          </svg>

          <div className={"status"}>
            <div className={"nextAction"}>{draft.pick ? "Pick" : "Ban"}</div>
            <div className={"timeRemaining"}>
              {toReadableTime(draft.activeteam_time_remaining)}
            </div>

            <div className={"reserveTimeRemaining"}>
              {toReadableTime(reserveTime)}
            </div>
            <div className={"reserveTimeLabel"}>Reserve</div>
          </div>

          <svg
            className={"direPickIndictator"}
            width={"1.5rem"}
            viewBox="0 0 169 298"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.338501 20.338V277.662C0.338501 295.48 21.8815 304.403 34.4805 291.804L163.142 163.142C170.952 155.332 170.952 142.668 163.142 134.858L34.4805 6.19601C21.8815 -6.40399 0.338501 2.52001 0.338501 20.338Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <style jsx>{`
          .info {
            background-color: #3c3c3c;
            box-shadow: 0 3px 15px rgba(0, 0, 0, 0.2);
            height: 22rem;
            margin: calc(-50px - 4rem) 1rem calc(-52px - 4rem) 1rem;
            padding: 1rem 2rem;
            font-family: Rubik;
            position: relative;
          }

          .teamRadiantStats {
            position: absolute;
            left: -5rem;
            top: 2.5rem;
            background-color: #2d8f00;
            height: 40px;
            width: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-weight: bold;
            font-size: 25px;
          }

          .teamDireStats {
            position: absolute;
            right: -5rem;
            top: 2.5rem;
            background: #8f001f;
            height: 40px;
            width: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-weight: bold;
            font-size: 25px;
          }

          .headerStats {
            text-align: center;
            font-size: 20px;
          }

          .type {
            text-transform: uppercase;
            font-size: 18px;
            color: #ccc;
          }

          .stats {
            font-size: 30px;
            font-weight: bold;
            color: #fff;
            margin: 0.5rem 0;
          }

          .draftState {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .status {
            margin: 2rem 0;
            text-align: center;
          }

          .nextAction {
            font-size: 35px;
            font-weight: bold;
            color: #fff;
            text-transform: uppercase;
          }

          .timeRemaining {
            font-size: 50px;
            font-weight: bold;
            color: #00acee;
            transition: font-size 120ms ease-in-out, color 120ms ease-in-out,
              margin 120ms ease-in-out;
          }

          .reserveTimeActive .timeRemaining {
            font-size: 30px;
            color: #fff;
            margin-bottom: -0.25rem;
          }

          .reserveTimeRemaining {
            margin-top: 0.5rem;
            font-size: 30px;
            font-weight: bold;
            color: #fff;
            transition: font-size 120ms ease-in-out, color 120ms ease-in-out,
              margin 120ms ease-in-out;
          }

          .reserveTimeActive .reserveTimeRemaining {
            font-size: 50px;
            color: #00acee;
            margin-top: 0 0 0.5rem 0;
          }

          .reserveTimeLabel {
            text-transform: uppercase;
            font-size: 20px;
            color: #aaa;
          }

          .radiantPickIndictator,
          .direPickIndictator {
            color: #666;
          }

          .isRadiantTurn .radiantPickIndictator {
            color: #3fc700;
          }

          .isDireTurn .direPickIndictator {
            color: #da0231;
          }
        `}</style>
      </div>
    );
  }

  return null;
}
