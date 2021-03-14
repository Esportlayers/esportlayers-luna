import {
  EventTypes,
  GsiGameStateMessage,
  GsiMatchIdMessage,
  isGsiGameStateMessage,
  useTetherMessageListener,
} from "@esportlayers/io";
import { ReactElement, useCallback, useEffect, useState } from "react";

import Ban from "./Ban";
import Draft from "./Draft";
import { GameState } from "@esportlayers/morphling";
import Teams from "./Teams";
import { get } from "../../modules/Network";

const visibleGameStates = new Set([
  GameState.heroSelection,
  GameState.strategyTime,
]);

export interface MatchDetails {
  id: number;
  radiant: {
    name: string;
    logo: string | null;
    wins: number;
  };
  dire: {
    name: string;
    logo: string | null;
    wins: number;
  };
  seriesType: number;
}

export async function fetchMatchDetails(
  apiKey: string,
  matchId: number
): Promise<MatchDetails> {
  return await get<MatchDetails>(
    `/live/matchDetails/${matchId}?frameApiKey=${apiKey}`,
    "json"
  );
}

interface Props {
  apiKey: string;
}
export default function Panel({ apiKey }: Props): ReactElement | null {
  const [matchDetails, setMatchDetails] = useState<MatchDetails>();
  const { value: matchId } = useTetherMessageListener<GsiMatchIdMessage>(
    EventTypes.gsi_match_id
  );
  const { value: gameState } = useTetherMessageListener<GsiGameStateMessage>(
    EventTypes.gsi_game_state
  );

  const fetchMatch = useCallback(
    async (matchId: number) =>
      setMatchDetails(await fetchMatchDetails(apiKey, matchId)),
    [apiKey]
  );

  useEffect(() => {
    if (matchId && +matchId !== matchDetails?.id) {
      fetchMatch(+matchId);
    }
  }, [matchId]);

  if (visibleGameStates.has(gameState)) {
    return (
      <div className={"draftPanel"}>
        <Teams matchDetails={matchDetails} />
        <div className={"draftGrid"}>
          <Draft matchDetails={matchDetails} />
        </div>

        <div className={"banGrid"}>
          <Ban />
        </div>

        <style jsx>{`
          .draftPanel {
            margin: -20rem 5rem 5rem 5rem;
            width: calc(100% - 10rem);
            height: 20rem;
            background: #fff;
            box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.5);
            padding: 1rem 2rem;
            display: flex;
            flex-direction: column;
            align-items: stretch;
          }

          .draftGrid,
          .banGrid {
            display: grid;
            flex: 1;
            grid-template-columns: 0.5fr 22rem 0.5fr;
            padding: 2rem 0;
          }

          .banGrid {
            flex: 0;
            padding: 0;
          }
        `}</style>
      </div>
    );
  }
  return null;
}
