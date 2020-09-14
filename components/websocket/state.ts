import dayjs from 'dayjs';
import { BetRoundStats } from '@streamdota/shared-types';

enum ACTIONS {
    NEW_MESSAGE = 'NEW_MESSAGE',
}

export enum MessageType {
    chat = 'chat',
    betting = 'betting',
    overlay='overlay',
    gsi_roshan = 'gsi_roshan',
    gsi_connected = 'gsi_connected',
    gsi_draft = 'gsi_draft',
    gsi_gamedata = 'gsi_gamedata',
    gsi_game_paused = 'gsi_game_paused',
    gsi_game_state = 'gsi_game_state',
    gsi_game_winner = 'gsi_game_winner',
    gsi_game_win_chance = 'gsi_game_win_chance',
    statsoverlay = 'statsoverlay',
}

export interface BaseMessage {
    type: MessageType;
    date: number;
}

export enum GameState {
    DOTA_GAMERULES_STATE_WAIT_FOR_PLAYERS_TO_LOAD = 'DOTA_GAMERULES_STATE_WAIT_FOR_PLAYERS_TO_LOAD',
    DOTA_GAMERULES_STATE_HERO_SELECTION = 'DOTA_GAMERULES_STATE_HERO_SELECTION',
    DOTA_GAMERULES_STATE_STRATEGY_TIME = 'DOTA_GAMERULES_STATE_STRATEGY_TIME',
    DOTA_GAMERULES_STATE_TEAM_SHOWCASE = 'DOTA_GAMERULES_STATE_TEAM_SHOWCASE',
    DOTA_GAMERULES_STATE_WAIT_FOR_MAP_TO_LOAD = 'DOTA_GAMERULES_STATE_WAIT_FOR_MAP_TO_LOAD',
    DOTA_GAMERULES_STATE_PRE_GAME = 'DOTA_GAMERULES_STATE_PRE_GAME',
    DOTA_GAMERULES_STATE_GAME_IN_PROGRESS = 'DOTA_GAMERULES_STATE_GAME_IN_PROGRESS',
    DOTA_GAMERULES_STATE_POST_GAME = 'DOTA_GAMERULES_STATE_POST_GAME'
}

export interface GsiGameStateMessage extends BaseMessage {
    type: MessageType.gsi_game_state;
    value: GameState;  
};

export interface ChatMessage extends BaseMessage  {
    type: MessageType.chat;
    value: {
        user: string;
        message: string;
    };
}
export interface BettingMessage extends BaseMessage {
    type: MessageType.betting;
    value: BetRoundStats;
}

export interface GsiRoshanMessage extends BaseMessage {
    type: MessageType.gsi_roshan;
    value: {
        state: 'alive' | 'respawn_base' | 'respawn_variable' | 'aegis';
        remaining: number;
    };
}

export interface GsiGameDataMessage extends BaseMessage {
    type: MessageType.gsi_gamedata;
    value: {
        matchId: number;
        type: 'playing' | 'observing';
        gameState: GameState;
        paused: boolean;
        winner: string;
        radiantWinChance: number;
        radiant?: {
            name: string;
            logo: string;
        };
        dire?: {
            name: string;
            logo: string;
        };
    };
}

export interface GsiConnectedMessage extends BaseMessage {
    type: MessageType.gsi_connected;
    value: boolean;
}

export interface GsiPauseMessage extends BaseMessage {
    type: MessageType.gsi_game_paused;
    value: boolean;
}

export interface GsiWinnerMessage extends BaseMessage {
    type: MessageType.gsi_game_winner;
    value: {
        isPlayingWin: boolean;
        winnerTeam: 'none' | 'radiant' | 'dire';
    };
}

export interface OverlayMessage extends BaseMessage {
    type: MessageType.overlay;
    value: boolean;
}

export interface StatsOverlayMessage extends BaseMessage {
    type: MessageType.statsoverlay;
    value: {
        heroId: number;
        heroClass: string;
        totalGamesCount: number;
        matchCount: number;
        matchWins: number;
        banCount: number;
    };
}

export type Message =  StatsOverlayMessage | GsiGameStateMessage | GsiGameDataMessage | ChatMessage | BettingMessage | GsiConnectedMessage | GsiRoshanMessage | GsiWinnerMessage | OverlayMessage | GsiPauseMessage;

export function isGsiRoshanMessage(msg: Message): msg is GsiRoshanMessage {
    return msg.type === MessageType.gsi_roshan;
}

export function isGsiWinnerMessage(msg: Message): msg is GsiWinnerMessage {
    return msg.type === MessageType.gsi_game_winner;
}

export function isGsiConnectedMessage(msg: Message): msg is GsiConnectedMessage {
    return msg.type === MessageType.gsi_connected;
}

export function isGsiPausedMessage(msg: Message): msg is GsiPauseMessage {
    return msg.type === MessageType.gsi_game_paused;
}

export function isGsiGameStateMessage(msg: Message): msg is GsiGameStateMessage {
    return msg.type === MessageType.gsi_game_state;
}

export function isGsiGameDataMessage(msg: Message): msg is GsiGameDataMessage {
    return msg.type === MessageType.gsi_gamedata;
}

export function isOverlayMessage(msg: Message): msg is OverlayMessage {
    return msg.type === MessageType.overlay;
}

export function isStatsOverlayMessage(msg: Message): msg is StatsOverlayMessage {
    return msg.type === MessageType.statsoverlay;
}

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