export const DEFAULT_EVENT = {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    ERROR: 'error',
    CONNECTION_ERROR: 'connection_error',
};

// SUBSCRIBE ROOM LIVESTREAM
export const SOCKET_ON_LIVESTREAM_EVENT = {
    SUBSCRIBE_LIVESTREAM_CHANNEL: `subscribe_livestream_channel`,
    UNSUBSCRIBE_LIVESTREAM_CHANNEL: `unsubscribe_livestream_channel`,
};

export const SOCKET_ON_MESSAGE_CHANNEL_EVENT = {
    SUBSCRIBE_MESSAGE_CHANNEL: `subscribe_message_channel`,
    UNSUBSCRIBE_MESSAGE_CHANNEL: `unsubscribe_message_channel`,
};

export const SOCKET_EVENT = {
    FLOWER_DELIVERY: 'flower_delivery',
    NOTIFICATION: 'notification:created',
    REPORT: 'excel_link',
    ASYNC: 'server_stats',
};

export const LIVESTREAM_EVENT = {
    SERVER_STOP_LIVESTREAM: 0,
    SHOP_STOP_LIVESTREAM: 1,
    REACTION: 2,
    COMMENT: 3,
    DELETE_COMMENT: 4,
    COUNT_SUBCRIBER: 5,
    CREATE_UPDATE_PRODUCT: 6,
    HIGHLIGHT_PRODUCT: 7,
    DELETE_PRODUCT: 8,
};
export const POST_EVENT = {
    REACTION_POST: 0,
    UNREACTION_POST: 1,
    REACTION_COMMENT_POST: 2,
    UNREACTION_COMMENT_POST: 3,
    COMMENT: 4,
    DELETE_COMMENT: 5,
};
export const MESSAGE_EVENT = {
    SEND_MESSAGE: 0,
    TYPING: 1,
    READ: 2,
};
export const USER_EVENT = {
    NEW_MESSAGE: 0,
    NEW_CHANNEL_MESSAGE: 1,
    NEW_NOTIFICATION: 2,
};
export const SHOP_EVENT = {
    NEW_MESSAGE: 0,
    NEW_CHANNEL_MESSAGE: 1,
    NEW_NOTIFICATION: 2,
};

export const withLiveStreamChannel = (livestream_id: number): string => {
    return `livestream_${livestream_id}`;
};
export const withPostChannel = (post_id?: number): string => {
    return `post_${post_id}`;
};
export const withTopicMessageChannel = (topic_message_id: number | string): string => {
    return `new_mesage`;
};
export const withUserChannel = (user_id: number): string => {
    return `user_id_${user_id}`;
};
export const withShopChannel = (shop_id: number): string => {
    return `shop_id_${shop_id}`;
};
// export const withOrderShopChannel = (shop_id: number): string => {
//   return `shop_id_${shop_id}`
// }
export const withAdmin = () => {
    return `admin`;
};

export interface ResponseSocketModel {
    code: number;
    status: number;
    create_at: Date;
    data: any;
    message: string;
    type_action: number;
    is_read?: number;
    id?: number;
}
