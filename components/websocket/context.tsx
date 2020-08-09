import React, {createContext, Dispatch, useContext, useReducer} from 'react';
import {State} from './state';
import MessageHandler from './MessageHandler';

export const WebsocketContext = createContext({});
export const ContextProvider = ({reducer, initialState, children, url}) =>(
    <WebsocketContext.Provider value={useReducer(reducer, initialState)}>
        <MessageHandler url={url}/>
        {children}
    </WebsocketContext.Provider>
);
export default ContextProvider;

export const useStateValue = (): [State, Dispatch<{}>] => useContext(WebsocketContext) as  [State, Dispatch<{}>];
