import { routerPage } from '@/config/contants.routes';
import useCallContext from '@/hooks/useCallContext';
import { uuid } from '@/utils';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getDataMessageDetail, getDetail } from '../service/ChatService';
import { UserInfoState } from '../types';
import ChatBody from './ChatBody';
import ChatHeader from './ChatHeader';
import TypingChatArea from './TypingChatArea';
import './css/styles.css';

interface IChatArea {
    setIsStartNewTopic: React.Dispatch<React.SetStateAction<boolean>>;
}

function ChatArea(props: IChatArea) {
    const { setIsStartNewTopic } = props;
    const history = useNavigate();
    const { id } = useParams();
    const { state } = useCallContext();
    const chattingUserState = useSelector((state: any) => state.messageNotReadReducer.chatingUserInfo);
    const [topicInfo, setTopicInfo] = useState<any | null>(null);
    const [selfInfo, setSelfInfo] = useState<any | null>(null);
    const [otherInfo, setOtherInfo] = useState<UserInfoState | null>(null);
    const [total, setTotal] = useState<any>(0);
    const [selfIsUser, setSeltIsUser] = useState<boolean>(false);
    const [isLoadingFirstTime, setIsLoadingFirstTime] = useState<boolean>(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [page, setPage] = React.useState(1);
    const [checkSend, setCheckSend] = useState(false);

    const getInfoTopicMessage = async () => {
        if (id) {
            try {
                setIsLoadingFirstTime(true);
                const res = await getDetail(Number(id));
                const resMessage: any = await getDataMessageDetail(id, 1);
                setMessages(resMessage?.data);
                setTopicInfo(res.data);
                setOtherInfo(resMessage?.data);
                setTotal(resMessage?.paging?.totalItem);
                setSeltIsUser(false);
            } catch (error) {
                history(`${routerPage.chat}`);
            } finally {
                setIsLoadingFirstTime(false);
            }
        }
    };

    useEffect(() => {
        if (id !== 'default_id') {
            getInfoTopicMessage();
        } else {
            setOtherInfo(chattingUserState);
        }
    }, [id]);

    useEffect(() => {
        const handleNewMessage = (data: any) => {
            const conversationId = data?.data?.conversation_id?.toString();

            // Chỉ cập nhật messages nếu conversation_id trùng với id
            if (conversationId === id?.toString()) {
                const newMessage = {
                    id: uuid(),
                    content: data?.data?.content,
                    create_at: data?.data?.create_at,
                    image: data?.data?.image,
                    video: data?.data?.video,

                    createdByUser: {
                        id: data?.data?.sender?.id,
                        fullName: data?.data?.sender?.username,
                        avatar: data?.data?.sender?.image,
                    },
                };

                setMessages((prevState) => {
                    return [newMessage, ...prevState];
                });
            }
        };

        if (state.socket?.connected) {
            state.socket.on(`new_message`, handleNewMessage);
        }

        // Dọn dẹp: Loại bỏ trình nghe sự kiện khi component unmount hoặc khi ID thay đổi
        return () => {
            if (state.socket?.connected) {
                state.socket.off(`new_message`, handleNewMessage);
            }
        };
    }, [state.socket?.connected, id]);

    return (
        <div style={{ height: '92%' }}>
            <ChatHeader
                name={topicInfo?.name}
                id={id}
                phone={topicInfo?.description}
                lastSendMessage={topicInfo?.garden?.users.length}
                avatar={topicInfo?.thumbnail}
                isLoading={isLoadingFirstTime}
            />
            <ChatBody
                checkSend={checkSend}
                page={page}
                setPage={setPage}
                setMessages={setMessages}
                id={id}
                total={total}
                messages={messages}
                setCheckSend={setCheckSend}
                selfIsUser={selfIsUser}
                selfInfo={selfInfo}
                otherInfo={otherInfo}
                isLoading={isLoadingFirstTime}
            />
            <TypingChatArea
                setCheckSend={setCheckSend}
                setMessages={setMessages}
                id={id}
                otherInfo={otherInfo}
                setIsStartNewTopic={setIsStartNewTopic}
            />
        </div>
    );
}
export default ChatArea;
