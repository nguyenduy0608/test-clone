export interface PropsUseWsMessage {
    channel_id: number
}

export interface ChatItemParam {
    id: string | undefined
}

export interface UserInfoState {
    id: number
    name: string
    phone: number
    phone_number: number
    profile_picture_url: string
    user_id?: number
    userId?: number
    shop_id?: number
    fullName: string
}

export interface TopicMessageState {
    id: number
    shop_id: number
    user_id: number
    Shop: UserInfoState
    User: UserInfoState
    create_at: any
    time_last_send: Date
}
export interface MessageItem {
    id: number
    content?: string
    shop_id: number | null
    user_id: number | null
    message_media_url?: string
    type_message_media?: number
    reply_message_id: number
    account_id: number
    create_at: Date
    is_active: 0 | 1
    user_role: 'user' | 'admin'
    Account: any
    User: any
}
