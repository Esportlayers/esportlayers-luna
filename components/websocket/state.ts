import dayjs from 'dayjs';
import { BetRoundStats } from '@streamdota/shared-types';

enum ACTIONS {
    NEW_MESSAGE = 'NEW_MESSAGE',
}

export enum MessageType {
    chat = 'chat',
    gamestate = 'gamestate',
    connected = 'connected',
    winner = 'winner',
    betting = 'betting',
}

export interface GameStateMessage {
    type: MessageType.gamestate;
    date: number;
    value: string;  
};

export interface WinnerMessage {
    type: MessageType.winner;
    date: number;
    value: boolean;
}

export interface ChatMessage {
    type: MessageType.chat;
    date: number;
    value: {
        user: string;
        message: string;
    };
}
export interface BettingMessage {
    type: MessageType.betting;
    date: number;
    value: BetRoundStats;
}
export interface ConnectedMessage {
    type: MessageType.connected;
    date: number;
    value: boolean;
}

export type Message =  GameStateMessage | WinnerMessage | ChatMessage | BettingMessage | ConnectedMessage;

interface NewMessageAction {
    type: typeof ACTIONS.NEW_MESSAGE;
    message: Message;
}

export interface State {
    messages: Array<Message>;
}

export const initialState: State = {
    messages: [],
};

export const reducer = (state: State, action: NewMessageAction) => {
    switch (action.type) {
        case ACTIONS.NEW_MESSAGE:
            return {
                ...state,
                messages: [
                    ...state.messages,
                    action.message,
                ],
            };
        default:
            return state;
    }
};

export function newMessage(message: Message): NewMessageAction {
    return {
        message: {
            ...message,
            date: dayjs().unix(),
        },
        type: ACTIONS.NEW_MESSAGE,
    };
}