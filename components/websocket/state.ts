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
    dota_wl_reset = 'dota_wl_reset',
    betting_v2 = 'betting_v2',
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
        respawnTime: number;
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

export enum StatsOverlayMessages {
    heroStats = 'heroStats',
    playerCompareGraph = 'playerCompareGraph'
}
export interface BaseStatsOverlayMessage {
    type: StatsOverlayMessages;
}

export interface HeroStatsOverlayValue extends BaseStatsOverlayMessage {
    type: StatsOverlayMessages.heroStats;
    heroId: number;
    heroClass: string;
    totalGamesCount: number;
    matchCount: number;
    matchWins: number;
    banCount: number;
}

export interface PlayerCompareGraphValue extends BaseStatsOverlayMessage {
    StatsOverlayMessages: StatsOverlayMessages.playerCompareGraph;
    dataType: 'net_worth' | 'xpm' | 'gpm' | 'hero_damage' | 'runes_activated' | 'camps_stacked' | 'support_gold_spent'
    data: Array<{absolute: number; percentage: number}>;
}

export interface StatsOverlayMessage extends BaseMessage {
    type: MessageType.statsoverlay;
    value: HeroStatsOverlayValue |PlayerCompareGraphValue;
}

export function isHeroStatsOverlayMessage(value: StatsOverlayMessage['value']): value is HeroStatsOverlayValue {
    return value.type === StatsOverlayMessages.heroStats;
}
export function isPlayerCompareGraphMessage(value: StatsOverlayMessage['value']): value is PlayerCompareGraphValue {
    return value.type === StatsOverlayMessages.playerCompareGraph;
}

export interface DotaWLReset extends BaseMessage {
    type: MessageType.dota_wl_reset;
}

export interface BetRoundData {
    status: 'stream_delay' | 'betting' | 'game_running' | 'finished';
    overlayVisibleUntil: number;
    overlayVisible: boolean;
    streamDelay: number;
    votingStartingAt: number;
    votingTimeRemaining: number;
    votingPossibleUntil: number;
    voteCreated: number;
    totalVotesCount: number;
    chatterCounts: number;
    teamACount: number;
    teamAVoters: string[];
    teamBCount: number;
    teamBVoters: string[];
    allVoters: string[];
    winner: null | string;
    winnerAnnouncement: null | number;
    announcedStart: boolean;
    announcedVoteEnd: boolean;
    announcedWinner: boolean;
}

export interface BettingV2Message extends BaseMessage {
    type: MessageType.betting_v2;
    value: BetRoundData;
}

export type Message = BettingV2Message | DotaWLReset | StatsOverlayMessage | GsiGameStateMessage | GsiGameDataMessage | ChatMessage | BettingMessage | GsiConnectedMessage | GsiRoshanMessage | GsiWinnerMessage | OverlayMessage | GsiPauseMessage;

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

export function isDotaWLReset(msg: Message): msg is DotaWLReset {
    return msg.type === MessageType.dota_wl_reset;
}

export function isBettingV2Message(msg: Message): msg is BettingV2Message {
    return msg.type === MessageType.betting_v2;
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