import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ResponseSocketModel, USER_EVENT, withShopChannel, withUserChannel } from '../utils/socketConstants';
import { getDataListMessage, getDataListMessageUnread } from '../service/ChatService';
import { getMessageNotReadAction } from '../slices/MessageNotReadSlice';
import { WebSocket } from '@/apis/WebSocket';

export default function useWsListTopicMessage() {
    const { userInfo: UserInstance } = useSelector((state: any) => state.authReducer);
    const dispatch = useDispatch();
    const selectedTopic = useRef();
    const [isLoadingFirstTime, setIsLoadingFirstTime] = useState<boolean>(false);
    const [listTopicMessage, setListTopicMessage] = useState<Array<any>>([]);
    const [pagingTopicMessage, setPagingTopicMessage] = useState({
        total: 0,
        current: 1,
        pageSize: 20,
    });
    const [isLoadingFirstTimeUnRead, setIsLoadingFirstTimeUnRead] = useState<boolean>(false);
    const [listTopicMessageUnRead, setListTopicMessageUnRead] = useState<Array<any>>([]);
    const [pagingTopicMessageUnRead, setPagingTopicMessageUnRead] = useState({
        total: 0,
        current: 1,
        pageSize: 20,
    });
    useEffect(() => {
        if (UserInstance?.id) {
            console.log(1);
            onUserHasNewMessage();
            getListTopic();
            getListTopicUnRead();
        }
        if (UserInstance?.admin) {
            // onShopHasNewMessage()
            onSocketEvent();
        }
    }, [UserInstance]);

    useEffect(() => {}, [selectedTopic]);

    const onSocketEvent = () => {
        WebSocket.socketClient?.onAny((event: string, data: any) => {
            if (event.includes('shop_id')) {
                const kiotvietID = Number(event.slice(8, event?.length));
                if (UserInstance.admin?.kiotviet_id === null || UserInstance.admin?.kiotviet_id === kiotvietID)
                    onAdminHasNewMessage(data);
            }
        });
    };

    const onAdminHasNewMessage = (res: any) => {
        if (res?.type_action === USER_EVENT.NEW_CHANNEL_MESSAGE) {
            setListTopicMessage((prevState) => {
                const topicMessage = prevState?.find((item) => item?.id === res?.data?.id);
                // channel message not existed in listTopicMessage
                if (!topicMessage) return [res?.data, ...prevState];
                // channel message existed in listTopicMessage
                else {
                    const newListTopicMessage = prevState?.filter((item) => item.id !== res?.data?.id);
                    const message = res?.data?.Messages?.[0];
                    if (message) {
                        message.create_at = new Date();
                    }

                    return [res.data, ...newListTopicMessage];
                }
            });

            setListTopicMessage((prevState) => {
                // Danh sách cũ
                const newListMesage = prevState?.filter((item) => item?.id !== res?.data?.id);

                // Cuộc hội thoại có tin nhắn mới
                const message = res?.data?.Messages?.[0];

                if (message) {
                    message.create_at = new Date();
                }
                if (message?.user_role !== 'admin' && message?.topic_message_id !== selectedTopic?.current && res) {
                    // Xác định xem có hiển thị chấm đỏ hay không
                    res.data.count_message_not_read = 1;
                } else {
                    res.data.count_message_not_read = 0;
                }

                return [res?.data, ...newListMesage];
            });
        }
        // new message event
        else if (res?.type_action === USER_EVENT.NEW_MESSAGE) {
            setListTopicMessage((prevState) => {
                // Danh sách cũ (không có tin nhắn mới đến)
                const newListMesage = prevState?.filter((item) => item?.id !== res?.data?.id);

                // Cuộc hội thoại có tin nhắn mới
                const message = res?.data?.Messages?.[0];
                if (message) {
                    message.create_at = new Date();
                }
                if (message?.user_role !== 'admin' && message?.topic_message_id !== selectedTopic?.current && res) {
                    res.data.count_message_not_read = 1;
                } else {
                    res.data.count_message_not_read = 0;
                }

                const newTopicMsg = { ...res?.data, Message: res?.data?.Messages };
                return [newTopicMsg, ...newListMesage];
            });
        }
    };

    const onUserHasNewMessage = () => {
        WebSocket.socketClient?.on(withUserChannel(UserInstance?.id), (res: ResponseSocketModel) => {
            // new channel event
            if (res.type_action === USER_EVENT.NEW_CHANNEL_MESSAGE) {
                setListTopicMessage((prevState) => {
                    const topicMessage = prevState?.find((item) => item?.id === res?.data?.id);
                    if (!topicMessage) return [res.data, ...prevState];
                    else {
                        const newListTopicMessage = prevState.filter((item) => item.id !== res?.data?.id);
                        const message = res?.data?.Messages?.[0];
                        if (message) {
                            message.create_at = new Date();
                        }
                        return [res.data, ...newListTopicMessage];
                    }
                });
            }

            // new message event
            else if (res.type_action === USER_EVENT.NEW_MESSAGE) {
                setListTopicMessage((prevState) => {
                    const newListMesage = prevState.filter((item) => item.id !== res?.data?.id);
                    const message = res?.data?.Messages?.[0];
                    if (message) {
                        message.create_at = new Date();
                    }
                    return [res.data, ...newListMesage];
                });
            }
        });
    };

    const getListTopic = async () => {
        setIsLoadingFirstTime(true);
        try {
            const res: any = await getDataListMessage({ page: 1 });
            if (res?.status) {
                const formattedPaging = {
                    total: res?.paging?.totalItemCount,
                    current: res?.paging?.page,
                    pageSize: res?.paging?.limit,
                };
                setPagingTopicMessage(formattedPaging);
                setListTopicMessage(res.data);
            }
        } catch (error) {
            console.log('error', error);
        } finally {
            setIsLoadingFirstTime(false);
        }
    };

    const getListTopicUnRead = async () => {
        setIsLoadingFirstTimeUnRead(true);
        try {
            const res: any = await getDataListMessageUnread({ page: 1 });
            if (res?.status) {
                const formattedPaging = {
                    total: res?.paging?.totalItemCount,
                    current: res?.paging?.page,
                    pageSize: res?.paging?.limit,
                };
                setPagingTopicMessageUnRead(formattedPaging);
                setListTopicMessageUnRead(res.data);
            }
        } catch (error) {
            console.log('error', error);
        } finally {
            setIsLoadingFirstTimeUnRead(false);
        }
    };
    return {
        isLoadingFirstTime,
        setIsLoadingFirstTime,
        listTopicMessage,
        setListTopicMessage,
        pagingTopicMessage,
        setPagingTopicMessage,
        selectedTopic,
        getListTopic,
        getListTopicUnRead,
    };
}
