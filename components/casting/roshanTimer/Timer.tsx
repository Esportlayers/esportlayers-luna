import GoogleFontLoader from "react-google-font-loader";
import { ReactElement } from "react";
import { RoshOverlay } from "@streamdota/shared-types";
import classNames from "classnames";
import { get } from "../../../modules/Network";
import { getVariant } from "../../dotaStats/DotaOverlayFrame";
import { useAbortFetch } from "../../../hooks/abortFetch";

interface Props {
  remaining: number;
  auth: string;
  state: "alive" | "respawn_base" | "respawn_variable" | "aegis";
}

export async function fetchRoshOverlay(
  abortController: AbortController,
  key: string
): Promise<RoshOverlay> {
  return await get<RoshOverlay>("/roshTimer?frameApiKey=" + key, "json", {
    signal: abortController.signal,
  });
}

export default function Timer({
  auth,
  remaining,
  state,
}: Props): ReactElement | null {
  const [cfg] = useAbortFetch(fetchRoshOverlay, auth);

  let timeLeft = state === "aegis" ? remaining - 180 : remaining;
  timeLeft = timeLeft < 0 ? 0 : timeLeft;
  const minutes = Math.floor((timeLeft || 0) / 60);
  let seconds: number | string = (timeLeft || 0) % 60;
  seconds = seconds >= 10 ? seconds : "0" + seconds;

  if (cfg) {
    return (
      <div
        className={classNames("wrapper", state)}
        style={{ ...getVariant(cfg.variant) }}
      >
        {cfg.font && cfg.font !== "Arial" && (
          <GoogleFontLoader
            fonts={[{ font: cfg.font, weights: [cfg.variant] }]}
          />
        )}
        <div className={"timer"}>
          {minutes}:{seconds}
        </div>

        <style jsx global>{`
          body,
          html {
            margin: 0;
            padding: 0;
            background-color: rgba(0, 0, 0, 0);
          }
        `}</style>

        <style jsx>{`
          .wrapper {
            height: 1080px;
            width: 1920px;
            background-image: url("/images/roshtimer_1080p.png");
            background-repeat: no-repeat;
            background-size: cover;
            position: relative;
            font-family: ${cfg.font}, Arial;
            font-size: ${cfg.fontSize}px;
            color: ${cfg.baseColor};
          }

          .timer {
            position: absolute;
            width: 63px;
            height: 30px;
            right: 1618px;
            bottom: 167px;
            line-height: 30px;
            text-align: center;
          }
          .respawn_variable {
            color: ${cfg.variableColor};
          }

          .aegis {
            color: ${cfg.aegisColor};
          }
        `}</style>
      </div>
    );
  }

  return null;
}
