import { Socket } from 'socket.io-client';

export const APP_LOADING = 'APP_LOADING';
export const SET_INFO = 'SET_INFO';
export const SET_SYNC_LOADING = 'SET_SYNC_LOADING';
export const SET_SOCKET = 'SET_SOCKET';
export const SET_BG_APP = 'SET_BG_APP';
export const SET_BG_APP_COLOR = 'SET_BG_APP_COLOR';
export const SET_COUNT_NOTI = 'SET_COUNT_NOTI';
export const SET_BG_APP_FLOWER = 'SET_BG_APP_FLOWER';
export const SET_CHILD_CATEGORY = 'SET_CHILD_CATEGORY';
export const SET_UNIT = 'SET_UNIT';


type ActionType =
    | typeof APP_LOADING
    | typeof SET_INFO
    | typeof SET_SYNC_LOADING
    | typeof SET_SOCKET
    | typeof SET_BG_APP
    | typeof SET_COUNT_NOTI
    | typeof SET_BG_APP_COLOR
    | typeof SET_BG_APP_FLOWER
    | typeof SET_UNIT

export type InitialStateType = {
    appLoading: boolean;
    info: any;
    syncLoading: boolean;
    socket: Socket | null;
    appBackground?: any;
    callbackNoti?: boolean;
    unit?: any;
};

export interface IAction {
    type: ActionType;
    payload?: any;
}

