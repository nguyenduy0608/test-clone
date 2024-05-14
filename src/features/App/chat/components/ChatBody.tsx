import useCallContext from '@/hooks/useCallContext';
import { Skeleton, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { getDataMessageDetail } from '../service/ChatService';
import { UserInfoState } from '../types';
import MessageItem from './MessageItem';
import './css/bootstrap.css';

interface ChatBodyProps {
    selfIsUser: boolean;
    selfInfo: UserInfoState | null;
    otherInfo: UserInfoState | null;
    id?: string;
    isLoading: boolean;
    messages: any[];
    total?: any;
    setMessages?: any;
    page?: any;
    checkSend: boolean;
    setPage?: any;
    setCheckSend?: any;
}

function ChatBody({
    id,
    selfIsUser: seltIsUser,
    selfInfo,
    otherInfo,
    isLoading,
    messages,
    setCheckSend,
    setMessages,
    total,
    page,
    checkSend,
    setPage,
}: ChatBodyProps) {
    // const { listMessage, setListMessage, pagingMessage, setPagingMessage } = useWsListMessage(id);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [canLoading, setCanLoading] = useState<boolean>(false);

    const state: any = useCallContext();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollToBottom();
        const res: any = getDataMessageDetail(id, 1);
    }, [messages, checkSend]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
        }
    };

    const getMoreMessage = async () => {
        if (!isLoadingMore && messages?.length < total) {
            try {
                setIsLoadingMore(true);
                const res: any = await getDataMessageDetail(id, page);
                const formattedPaging = {
                    total: res.paging.totalItem,
                    current: res.paging.page,
                    pageSize: res.paging.pageSize,
                };
                // setPagingMessage(formattedPaging);
                setMessages([...messages, ...res.data]);
                if (formattedPaging.total > messages?.length + res.data?.length) {
                    setCanLoading(false);
                } else {
                    setCanLoading(true);
                }
            } catch (error) {
                console.log('err', error);
                setCanLoading(false);
            } finally {
                setIsLoadingMore(false);
            }
        }
    };
    useEffect(() => {
        if (id !== 'default_id') {
            const infiniteListBody: any = document.getElementById('infiniteListBody');
            infiniteListBody.addEventListener('scroll', (e: any) => {
                const el = e.target;
                if (el.clientHeight - el.scrollHeight > el.scrollTop - 50 && !isLoadingMore) {
                    setCanLoading(true);
                }
            });
            // setPagingMessage({
            //     total: 0,
            //     current: 1,
            //     pageSize: 0,
            // });
            setPage(2);
            setCanLoading(false);
        } else {
        }
    }, [id]);

    useEffect(() => {
        if (canLoading) {
            getMoreMessage();
            setPage((prev: any) => prev + 1);
        }
    }, [canLoading]);

    return (
        <>
            <ol className="chat-body-scroll" id="infiniteListBody">
                {isLoading ? (
                    <Spin
                        style={{
                            marginBottom: '20%',
                            width: '100%',
                            textAlign: 'center',
                        }}
                        tip="Đang tải..."
                        size="large"
                    />
                ) : (
                    <>
                        <div ref={messagesEndRef}></div>

                        {messages?.map((item: any, index: number) => {
                            return (
                                <MessageItem
                                    key={index}
                                    is_self={item?.createdByUser?.id === state?.state?.info?.id}
                                    avatar={item?.createdByUser?.avatar}
                                    content={item?.content}
                                    message_media_url={item?.image}
                                    video={item?.video}
                                    create_at={item?.createdAt}
                                    type_message_media={item?.type_message_media}
                                    user={{
                                        name: item?.createdByUser?.fullName,
                                        kiotviet_name: item?.kiotviet_name,
                                        branch_name: item?.branch_name,
                                        role: item?.createdByUser?.type,
                                        user_role: item?.user_role,
                                    }}
                                />
                            );
                        })}
                    </>
                )}
                {isLoadingMore && (
                    <li style={{ width: '90%', marginLeft: '5%', marginTop: 0 }}>
                        <Skeleton
                            loading={true}
                            active
                            paragraph={{ rows: 1, width: '100%' }}
                            title={{ width: '100%' }}
                        />
                    </li>
                )}
            </ol>
        </>
    );
}
export default ChatBody;
