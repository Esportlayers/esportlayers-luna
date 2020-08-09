import React, { ReactElement, useEffect, createContext, useReducer, useContext, Dispatch } from 'react';
import { useMessageListener } from '../websocket/MessageHandler';
import { MessageType, initialState as initialWebsocketState, reducer as websocketReducer } from '../websocket/state';
import ContextProvider from '../websocket/context';
import getWebsocketUrl from '../../modules/Router';
import { State, updateBetRound, initialState as initialBetState, reducer as betReducer } from './State';
import { useAbortFetch } from '../../hooks/abortFetch';
import { get } from '../../modules/Network';
import { BetRoundStats } from '@streamdota/shared-types';

export const BettingContext = createContext({});
export const useBetStateValue = (): [State, Dispatch<{}>] => useContext(BettingContext) as  [State, Dispatch<{}>];

export async function fetchBetRound(abortController: AbortController, key: string, season: number): Promise<BetRoundStats> {
    return await get<BetRoundStats>(`/bets/current?frameApiKey=${key}`, 'json', {signal: abortController.signal});
}


export const BetRoundLoader = ({auth}) => {
	const [, dispatch] = useBetStateValue();
	const [betRound] = useAbortFetch(fetchBetRound, auth);

	useEffect(() => {
		if(betRound) {
			dispatch(updateBetRound(betRound));
		}
	}, [betRound]);

	return <></>;
}

export const BetContextProvider = ({reducer, initialState, children, auth}) => (
    <BettingContext.Provider value={useReducer(reducer, initialState)}>
		<BetRoundLoader auth={auth} />
        {children}
    </BettingContext.Provider>
);


const BetStateUpdated = () => {
	const message = useMessageListener();
    const [, dispatch] = useBetStateValue();

	useEffect(
		() => {
			if (message && message.type === MessageType.betting) {
				dispatch(updateBetRound(message.value));
			}
		},
		[ message ]
	);

	return <React.Fragment />;
};

export default function BetContext({ auth, children }: { auth?: string; children: ReactElement }): ReactElement | null {
	if (auth) {
		return (
			<ContextProvider initialState={initialWebsocketState} reducer={websocketReducer} url={getWebsocketUrl()+'/bets/live/' + auth}>
				<BetContextProvider initialState={initialBetState} reducer={betReducer} auth={auth}>
					<BetStateUpdated />
					{children}
				</BetContextProvider>
			</ContextProvider>
		);
	}

	return null;
}
