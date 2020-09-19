import { BetRoundData } from '../websocket/state';

enum ACTIONS {
    UPDATE_BET_ROUND = 'UPDATE_BET_ROUND',
}

export interface State {
    betRound: BetRoundData | null;
}

export const initialState: State = {
    betRound: null,
};

interface UpdateBetRoundAction {
    type: typeof ACTIONS.UPDATE_BET_ROUND;
    betRound: BetRoundData;
}

export const reducer = (state: State, action: UpdateBetRoundAction) => {
    switch (action.type) {
        case ACTIONS.UPDATE_BET_ROUND:
            return {
                betRound: action.betRound,
            };
        default:
            return state;
    }
};

export function updateBetRound(betRound: BetRoundData): UpdateBetRoundAction {
    return {
        betRound,
        type: ACTIONS.UPDATE_BET_ROUND,
    };
}