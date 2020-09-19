import React, { ReactElement, useEffect, createContext, useReducer, useContext, Dispatch } from 'react';
import { useMessageListener } from '../websocket/MessageHandler';
import { initialState as initialWebsocketState, reducer as websocketReducer, isBettingV2Message } from '../websocket/state';
import ContextProvider from '../websocket/context';
import getWebsocketUrl from '../../modules/Router';
import { State, updateBetRound, initialState as initialBetState, reducer as betReducer } from './State';

export const BettingContext = createContext({});
export const useBetStateValue = (): [State, Dispatch<{}>] => useContext(BettingContext) as  [State, Dispatch<{}>];


export const BetContextProvider = ({reducer, initialState, children}) => (
    <BettingContext.Provider value={useReducer(reducer, initialState)}>
        {children}
    </BettingContext.Provider>
);


const BetStateUpdated = () => {
	const message = useMessageListener();
    const [, dispatch] = useBetStateValue();

	useEffect(
		() => {
			if (message && isBettingV2Message(message)) {
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
				<BetContextProvider initialState={initialBetState} reducer={betReducer}>
					<BetStateUpdated />
					{children}
				</BetContextProvider>
			</ContextProvider>
		);
	}

	return null;
}
