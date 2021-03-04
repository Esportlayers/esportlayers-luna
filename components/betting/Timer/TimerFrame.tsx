import {
  EventTypes,
  OverlayMessage,
  VoteRoundData,
  useTetherMessageListener,
  useVoteValue,
} from "@esportlayers/io";
import React, { ReactElement, useEffect, useState } from "react";

import { BetOverlay } from "@streamdota/shared-types";
import GoogleFontLoader from "react-google-font-loader";
import classNames from "classnames";
import dayjs from "dayjs";
import { get } from "../../../modules/Network";
import { getVariant } from "../../dotaStats/DotaOverlayFrame";
import { useAbortFetch } from "../../../hooks/abortFetch";
import { useInterval } from "../../../hooks/interval";

interface Props {
  auth: string;
  fullSize?: boolean;
  testing: boolean;
}

function calculateRemaining(currentBetRound: VoteRoundData): string {
  if (currentBetRound && currentBetRound.overlayVisible) {
    const diff = currentBetRound.overlayVisibleUntil - dayjs().unix();
    if (diff > 0) {
      const min = Math.floor(diff / 60);
      let sec: number | string = diff % 60;
      sec = sec < 10 ? "0" + sec : sec;
      return `${min}:${sec}`;
    }
    return "0:00";
  }
  return "0:00";
}

export async function fetchOverlay(
  abortController: AbortController,
  key: string
): Promise<BetOverlay> {
  return await get<BetOverlay>("/betsOverlay?frameApiKey=" + key, "json", {
    signal: abortController.signal,
  });
}

export default function Frame({
  auth,
  fullSize,
  testing,
}: Props): ReactElement | null {
  const [overlay, reaload] = useAbortFetch(fetchOverlay, auth);
  const [betRound] = useVoteValue();
  const [timer, setTimer] = useState(calculateRemaining(betRound));
  useInterval(() => setTimer(calculateRemaining(betRound)));
  const [cacheKey, setCacheKey] = useState(dayjs().unix());
  const {
    date: lastOverlayMessageDate,
  } = useTetherMessageListener<OverlayMessage>(EventTypes.overlay) || {
    date: null,
  };

  useEffect(() => {
    reaload();
    setCacheKey(lastOverlayMessageDate);
  }, [lastOverlayMessageDate]);

  if (overlay && ((betRound && betRound.overlayVisible) || testing)) {
    return (
      <div className={classNames("wrapper", { fullSize })} key={cacheKey}>
        {overlay.fontFamily && (
          <GoogleFontLoader
            fonts={[
              { font: overlay.fontFamily, weights: [overlay.fontVariant] },
            ]}
          />
        )}

        <div
          className={"counter"}
          style={{ ...getVariant(overlay.fontVariant) }}
        >
          {timer}
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
            background-color: ${overlay.timerBackground};
            font-size: ${overlay.timerFontSize}px;
            line-height: 1em;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.5em 0.75em;
            box-sizing: border-box;
          }

          .fullSize {
            height: 100vh;
            width: 100vw;
          }

          .counter {
            font-family: ${overlay.fontFamily};
            color: ${overlay.timerFont};
          }
        `}</style>
      </div>
    );
  }
  return null;
}
