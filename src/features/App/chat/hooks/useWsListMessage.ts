import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    MESSAGE_EVENT,
    ResponseSocketModel,
    SOCKET_ON_MESSAGE_CHANNEL_EVENT,
    withTopicMessageChannel,
} from '../utils/socketConstants';
import { requestGetListMessage, getDetail, getDataMessageDetail } from '../service/ChatService';
import { WebSocket } from '@/apis/WebSocket';

export default function useWsListMessage(channel_id?: any) {
    const { userInfo: UserInstance } = useSelector((state: any) => state.authReducer);
    const [listMessage, setListMessage] = useState<Array<any>>([]);
    const [pagingMessage, setPagingMessage] = useState({
        total: 0,
        current: 1,
        pageSize: 0,
    });

    const listener = (res: ResponseSocketModel) => {
        if (res.type_action === MESSAGE_EVENT.SEND_MESSAGE) {
            res.data.create_at = res.create_at;
            setListMessage((prevState) => [res.data, ...prevState]);
            if (res?.data?.shop_id !== UserInstance?.shop_id && res?.data?.user_id !== UserInstance?.id) {
                readAllMessage(res?.data?.topic_message_id);
            }
        }
    };

    const readAllMessage = async (topic_message_id: number) => {
        try {
            const res = await getDetail(topic_message_id);
        } catch (error) {}
    };

    const getMessageByTopicId = async () => {
        if (channel_id) {
            try {
                const res: any = await getDataMessageDetail(
                    channel_id.toString()
                    //  {
                    //     page: 1,
                    // }
                );
                const formattedPaging = {
                    total: res.paging.totalItemCount,
                    current: res.paging.page,
                    pageSize: res.paging.limit,
                };
                setPagingMessage(formattedPaging);
                setListMessage(res.data);
            } catch (error) {
                console.log('err', error);
            }
        }
    };

    // useEffect(() => {
    //     if (channel_id !== 'default_id') {
    //         getMessageByTopicId();
    //         WebSocket?.socketClient?.emit(SOCKET_ON_MESSAGE_CHANNEL_EVENT.SUBSCRIBE_MESSAGE_CHANNEL, channel_id);
    //         WebSocket.socketClient?.on(withTopicMessageChannel(channel_id), listener);
    //         return () => {
    //             WebSocket.socketClient?.off(withTopicMessageChannel(channel_id as string), listener);
    //             WebSocket.socketClient?.emit(SOCKET_ON_MESSAGE_CHANNEL_EVENT.UNSUBSCRIBE_MESSAGE_CHANNEL, channel_id);
    //         };
    //     } else {
    //         console.log('this case');

    //         setListMessage([]);
    //     }
    // }, [WebSocket?.socketClient, channel_id]);

    return { listMessage, setListMessage, pagingMessage, setPagingMessage };
}
