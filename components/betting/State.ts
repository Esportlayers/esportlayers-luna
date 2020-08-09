import { BetRoundStats } from '@streamdota/shared-types';

enum ACTIONS {
    UPDATE_BET_ROUND = 'UPDATE_BET_ROUND',
}


export interface State {
    betRound: BetRoundStats | null;
}

export const initialState: State = {
    betRound: {
        betSeason: 0,
        id: 0,
        round: 0,
        userId: 0,
        status: 'finished',
        created: 0,
        result: '',
        total: 0,
        aBets: 0,
        bBets: 0,
        chatters: 0,
    },
};

interface UpdateBetRoundAction {
    type: typeof ACTIONS.UPDATE_BET_ROUND;
    betRound: BetRoundStats;
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

export function updateBetRound(betRound: BetRoundStats): UpdateBetRoundAction {
    return {
        betRound,
        type: ACTIONS.UPDATE_BET_ROUND,
    };
}