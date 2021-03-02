import * as Sentry from "@sentry/react";

import { AnimatePresence, motion } from "framer-motion";
import DotaOverlayFrame, { fetchDotaOverlay } from "./DotaOverlayFrame";
import { DotaStats as DotaStatsEntitiy, User } from "@streamdota/shared-types";
import {
  DotaWLResetMessage,
  EventTypes,
  GsiActivityMessage,
  GsiConnectedMessage,
  GsiGameStateMessage,
  GsiGameWinnerMessage,
  OverlayMessage,
  useTetherMessageListener,
} from "@esportlayers/io";
import React, { ReactElement, useEffect, useMemo, useState } from "react";

import { GameState } from "@esportlayers/morphling";
import dayjs from "dayjs";
import { get } from "../../modules/Network";
import { useAbortFetch } from "../../hooks/abortFetch";

export async function fetchStats(
  abortController: AbortController,
  apiKey: string
): Promise<DotaStatsEntitiy[]> {
  return await get<DotaStatsEntitiy[]>(
    "/user/dotaStats?frameApiKey=" + apiKey,
    "json",
    { signal: abortController.signal }
  );
}

export async function fetchUser(
  abortController: AbortController,
  apiKey: string
): Promise<User> {
  const user = await get<User>("/user/baseData?frameApiKey=" + apiKey, "json", {
    signal: abortController.signal,
  });

  if (
    typeof window !== "undefined" &&
    process.env.NODE_ENV === "production" &&
    process.env.SENTRY_DSN &&
    process.env.SENTRY_DSN.length > 0
  ) {
    Sentry.setUser({
      id: `${user.id}`,
      username: user.displayName,
      twitchId: user.twitchId,
    });
  }

  return user;
}

const visibleGameStates = new Set([
  GameState.playersLoading,
  GameState.running,
  GameState.preGame,
]);

const pickGameStates = new Set([
  GameState.strategyTime,
  GameState.heroSelection,
]);

const mainMenuGameState = new Set([GameState.postGame]);

const variants = {
  hidden: {
    y: 60,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function Overlay({
  frameKey,
  testing,
  dynamicNumbers,
}: {
  frameKey: string;
  testing: boolean;
  dynamicNumbers: boolean;
}): ReactElement | null {
  const [cacheKey, setCacheKey] = useState(dayjs().unix());
  const [status, reloadStats] = useAbortFetch(fetchStats, frameKey);
  const [user] = useAbortFetch(fetchUser, frameKey);
  const [wins, setWins] = useState(0);
  const [lost, setLost] = useState(0);
  const [connected, setConnected] = useState(false);
  const [gamestate, setGamestate] = useState<GameState | null>(null);
  const [activityType, setActivityType] = useState<"playing" | "observing">(
    "playing"
  );
  const [cfg] = useAbortFetch(fetchDotaOverlay, frameKey);

  useEffect(() => setConnected(user && user.gsiActive), [user]);

  useEffect(() => {
    if (status) {
      let localWins = 0,
        localLost = 0;
      status.forEach(({ won }) => {
        if (won) {
          localWins++;
        } else {
          localLost++;
        }
      });
      setWins(localWins + wins);
      setLost(localLost + lost);
    }
  }, [status]);

  const {
    value: winnerMessage,
  } = useTetherMessageListener<GsiGameWinnerMessage>(
    EventTypes.gsi_game_winner
  ) || { value: null };
  const { value: isConnected } = useTetherMessageListener<GsiConnectedMessage>(
    EventTypes.gsi_connected
  ) || { value: false };
  const {
    value: gameStateMessageValue,
  } = useTetherMessageListener<GsiGameStateMessage>(
    EventTypes.gsi_game_state
  ) || { value: null };
  const {
    value: activityMessage,
  } = useTetherMessageListener<GsiActivityMessage>(
    EventTypes.gsi_game_activity
  ) || { value: null };
  const { date: lastOverlayMessage } = useTetherMessageListener<OverlayMessage>(
    EventTypes.overlay
  ) || { date: null };
  const { date: dotaWLReset } = useTetherMessageListener<DotaWLResetMessage>(
    EventTypes.dota_wl_reset
  ) || { date: null };

  useEffect(() => {
    if (winnerMessage && winnerMessage.winnerTeam !== "none") {
      if (winnerMessage.isPlayingWin) {
        setWins(wins + 1);
      } else {
        setLost(lost + 1);
      }
    }
  }, [winnerMessage]);

  useEffect(() => setConnected(isConnected), [isConnected]);
  useEffect(() => setGamestate(gameStateMessageValue), [gameStateMessageValue]);
  useEffect(() => setActivityType(activityMessage), [activityMessage]);
  useEffect(() => setCacheKey(lastOverlayMessage), [lastOverlayMessage]);
  useEffect(() => {
    if (dotaWLReset) {
      setWins(0);
      setLost(0);
      reloadStats();
    }
  }, [dotaWLReset]);

  const active = useMemo<boolean>(() => {
    return (
      connected &&
      activityType === "playing" &&
      (visibleGameStates.has(gamestate) ||
        (!Boolean(user.dotaStatsMenuHidden) &&
          (!gamestate || mainMenuGameState.has(gamestate))) ||
        (!Boolean(user.dotaStatsPickHidden) && pickGameStates.has(gamestate)))
    );
  }, [connected, gamestate, user]);

  if (cfg?.noAnimation) {
    if (active || testing || cfg?.alwaysVisible) {
      return (
        <DotaOverlayFrame
          wins={wins}
          loss={lost}
          auth={frameKey}
          key={cacheKey}
          dynamicNumbers={dynamicNumbers}
        />
      );
    }
    return <></>;
  }

  return (
    <AnimatePresence>
      {(active || testing || cfg?.alwaysVisible) && (
        <motion.div
          initial={"hidden"}
          animate={"visible"}
          exit={"hidden"}
          variants={variants}
          transition={{ duration: 2, type: "tween" }}
        >
          <DotaOverlayFrame
            wins={wins}
            loss={lost}
            auth={frameKey}
            key={cacheKey}
            dynamicNumbers={dynamicNumbers}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
