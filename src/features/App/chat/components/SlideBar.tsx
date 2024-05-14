import { routerPage } from '@/config/contants.routes';
import { MODE_MESSAGE } from '@/contants';
import useCallContext from '@/hooks/useCallContext';
import { uuid } from '@/utils';
import { Skeleton, Spin, Tabs } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useListMessageNotRead } from '../hooks/useListMessageNotRead';
import useWsListTopicMessage from '../hooks/useWsListTopicMessage';
import { getDataListMessage, getDataListMessageUnread, getDetail } from '../service/ChatService';
import AutoSearch from './AutoSearch';
import AutoSearchUnRead from './AutoSearchUnRead';
import TopicChatItem from './TopicChatItem';
import './css/styles.css';
interface ISlideBar {
    isStartNewTopic?: boolean;
}

function SlideBar(props: ISlideBar) {
    const { isStartNewTopic } = props;
    const location = useLocation();
    const navigate = useNavigate();
    const pathname = location.pathname;

    const dispatch = useDispatch();
    const split_pathname: Array<string> = pathname.split('/');
    const topic_message_id: string | undefined = split_pathname[split_pathname.length - 1];
    const { listTopicMessageNotRead } = useListMessageNotRead();
    const listNotReadMsgIds = listTopicMessageNotRead?.map((item: any) => item?.topic_message_id);

    const {
        isLoadingFirstTime,
        setIsLoadingFirstTime,
        listTopicMessage,
        setListTopicMessage,
        pagingTopicMessage,
        setPagingTopicMessage,
    } = useWsListTopicMessage();
    const [isLoadingFirstTimeUnRead, setIsLoadingFirstTimeUnRead] = useState<boolean>(false);
    const [listTopicMessageUnRead, setListTopicMessageUnRead] = useState<Array<any>>([]);
    const [pagingTopicMessageUnRead, setPagingTopicMessageUnRead] = useState({
        total: 0,
        current: 1,
        pageSize: 20,
    });
    const [isSearchMode, setIsSearchMode] = useState<boolean>(false);
    const [isSearchModeUnRead, setIsSearchModeUnRead] = useState<boolean>(false);
    const [listSearchTopicMessage, setListSearchTopicMessage] = useState<Array<any>>([]);
    const [listSearchTopicMessageUnRead, setListSearchTopicMessageUnRead] = useState<Array<any>>([]);
    const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [canLoading, setCanLoading] = useState<boolean>(false);
    const [isSearchLoadingUnRead, setIsSearchLoadingUnRead] = useState<boolean>(false);
    const [isLoadingMoreUnRead, setIsLoadingMoreUnRead] = useState<boolean>(false);
    const [canLoadingUnRead, setCanLoadingUnRead] = useState<boolean>(false);
    const [currentTab, setCurrentTab] = React.useState<string>('1');
    const [checkIsRead, setCheckIsRead] = React.useState<number>(0);
    const { state } = useCallContext();
    const chatId = useParams();
    const refFirstTimeRender = useRef<boolean>(false);
    const getListTopic = async () => {
        setIsLoadingFirstTime(true);
        try {
            const res: any = await getDataListMessage({
                page: 1,
                is_message_not_read: currentTab === '1' ? undefined : 1,
                limit: 9999,
            });
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
            const res: any = await getDataListMessageUnread({
                page: 1,
                is_message_not_read: currentTab === '1' ? undefined : 1,
                limit: 9999,
            });
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

    const searchListTopicMessage = async (search: string) => {
        setIsSearchLoading(true);
        try {
            const res = await getDataListMessage({
                page: 1,
                search: search.trim(),
                // is_message_not_read: currentTab === '1' ? undefined : 1,
            });
            setListSearchTopicMessage(res?.data);
        } catch (error) {
            console.log('error', error);
        } finally {
            setIsSearchLoading(false);
        }
    };
    const searchListTopicMessageUnRead = async (search: string) => {
        setIsSearchLoadingUnRead(true);
        try {
            const res = await getDataListMessageUnread({
                page: 1,
                search: search.trim(),
                // is_message_not_read: currentTab === '1' ? undefined : 1,
            });
            setListSearchTopicMessageUnRead(res?.data);
        } catch (error) {
            console.log('error', error);
        } finally {
            setIsSearchLoadingUnRead(false);
        }
    };

    const getMoreTopic = async () => {
        if (!isLoadingMore && listTopicMessage.length < pagingTopicMessage.total) {
            try {
                setIsLoadingMore(true);
                const res: any = await getDataListMessage({
                    page: pagingTopicMessage.current + 1,
                });
                const formattedPaging = {
                    total: res.paging.totalItemCount,
                    current: res.paging.page,
                    pageSize: res.paging.limit,
                };
                setPagingTopicMessage(formattedPaging);
                setListTopicMessage([...listTopicMessage, ...res.data]);
                if (formattedPaging.total > listTopicMessage.length + res.data.length) {
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
    const getMoreTopicUnRead = async () => {
        if (!isLoadingMoreUnRead && listTopicMessageUnRead?.length < pagingTopicMessageUnRead.total) {
            try {
                setIsLoadingMoreUnRead(true);
                const res: any = await getDataListMessageUnread({
                    page: pagingTopicMessageUnRead.current + 1,
                });
                const formattedPaging = {
                    total: res.paging.totalItemCount,
                    current: res.paging.page,
                    pageSize: res.paging.limit,
                };
                setPagingTopicMessageUnRead(formattedPaging);
                setListTopicMessageUnRead([...listTopicMessageUnRead, ...res.data]);
                if (formattedPaging.total > listTopicMessageUnRead.length + res.data.length) {
                    setCanLoadingUnRead(false);
                } else {
                    setCanLoadingUnRead(true);
                }
            } catch (error) {
                console.log('err', error);
                setCanLoadingUnRead(false);
            } finally {
                setIsLoadingMoreUnRead(false);
            }
        }
    };
    const onReadMessageNew = async (msgId: number) => {
        const newList = listTopicMessage?.map((item: any) => {
            if (item?.id === msgId) {
                return {
                    ...item,
                    count_message_not_read: 0,
                };
            }
            return item;
        });
        setListTopicMessage(newList);
        await getDetail(msgId);
    };

    const checkIsNotReadMsg = (id: number) => {
        return listNotReadMsgIds.includes(id);
    };

    const onChanegTab = (tab: string) => {
        setCurrentTab(tab);
        setIsSearchMode(false);
        setIsSearchModeUnRead(false);
        setPagingTopicMessage({
            ...pagingTopicMessage,
            current: 1,
        });
        setPagingTopicMessageUnRead({
            ...pagingTopicMessageUnRead,
            current: 1,
        });
    };
    useEffect(() => {
        if (state.socket?.connected) {
            state.socket.on(`new_message`, (data: any) => {
                const updatedList = listTopicMessage?.map((item: any) => {
                    if (item?.id === data?.data.conversation_id) {
                        return {
                            ...item,
                            messages: [
                                {
                                    content: data?.data?.content,
                                    image: data?.data?.image,
                                    video: data?.data?.video,
                                    nameSend: data?.data?.sender?.username,
                                    createdAt: data?.create_at,
                                    users: [
                                        {
                                            messagesUsers: {
                                                isRead:
                                                    state?.info?.id === data?.data?.sender?.id ||
                                                    chatId?.id === data?.data?.conversation_id.toString()
                                                        ? true
                                                        : false,
                                            },
                                        },
                                    ],
                                },

                                ...item.messages,
                            ],
                        };
                    }
                    return item;
                });

                const sortedList = [
                    updatedList?.find((item: any) => item?.id === data?.data.conversation_id),
                    ...updatedList?.filter((item: any) => item?.id !== data?.data.conversation_id),
                ];

                setListTopicMessage(sortedList);
            });
        }
    }, [state.socket?.connected, listTopicMessage]);
    useEffect(() => {
        if (state.socket?.connected) {
            state.socket.on(`new_message`, (data: any) => {
                setCheckIsRead(data?.data?.conversation_id);
                const updatedList = listTopicMessageUnRead?.map((item: any) => {
                    if (item?.id === data?.data.conversation_id) {
                        return {
                            ...item,
                            messages: [
                                {
                                    content: data?.data?.content,
                                    image: data?.data?.image,
                                    video: data?.data?.video,
                                    nameSend: data?.data?.sender?.username,
                                    createdAt: data?.create_at,
                                    users: [
                                        {
                                            messagesUsers: {
                                                createdAt: data?.create_at,
                                                isRead:
                                                    state?.info?.id === data?.data?.sender?.id ||
                                                    chatId?.id === data?.data?.conversation_id.toString()
                                                        ? true
                                                        : false,
                                            },
                                        },
                                    ],
                                },
                                ...item.messages, // Giữ nguyên các tin nhắn cũ
                            ],
                        };
                    }
                    return item;
                });

                // Kiểm tra nếu conversation_id không tồn tại trong danh sách hiện tại thì thêm vào mảng mới
                if (!listTopicMessageUnRead?.some((item) => item.id === data?.data.conversation_id)) {
                    updatedList?.unshift({
                        id: data?.data.conversation_id,
                        messages: [
                            {
                                content: data?.data?.content,
                                image: data?.data?.image,
                                video: data?.data?.video,
                                nameSend: data?.data?.sender?.username,
                                createdAt: data?.create_at,
                                users: [
                                    {
                                        messagesUsers: {
                                            createdAt: data?.create_at,
                                            isRead: state?.info?.id === data?.data?.sender?.id ? true : false,
                                        },
                                    },
                                ],
                            },
                        ],
                    });
                }
                updatedList.sort((a, b) => {
                    const aTime = a?.messages[0]?.createdAt || 0;
                    const bTime = b?.messages[0]?.createdAt || 0;
                    return bTime - aTime;
                });

                // Sắp xếp lại mảng để đưa item lên đầu
                setListTopicMessageUnRead(updatedList);
            });
        }
    }, [state.socket?.connected, listTopicMessageUnRead]);

    useEffect(() => {
        if (listTopicMessage.length !== 0 && !topic_message_id && !refFirstTimeRender.current) {
            refFirstTimeRender.current = true;
            navigate(`${routerPage.chat}/${listTopicMessage?.[0].id}`, { replace: true });
        }
    }, [listTopicMessage]);

    useEffect(() => {
        const infiniteListTopic: any = document.getElementById('infiniteListTopic');
        if (infiniteListTopic) {
            infiniteListTopic?.addEventListener('scroll', (e: any) => {
                const el = e.target;

                if (el.clientHeight + el.scrollTop + 10 > el.scrollHeight && !isLoadingMore) {
                    setCanLoading(true);
                }
            });
        }
    }, []);

    useEffect(() => {
        getListTopic();
    }, [isStartNewTopic, currentTab]);

    useEffect(() => {
        if (canLoading) {
            getMoreTopic();
        }
    }, [canLoading]);

    useEffect(() => {
        getListTopicUnRead();
    }, [isStartNewTopic, currentTab]);

    useEffect(() => {
        if (canLoadingUnRead) {
            getMoreTopicUnRead();
        }
    }, [canLoadingUnRead]);

    return (
        <CustomTabs defaultActiveKey="1" onChange={onChanegTab}>
            <CustomTabs.TabPane tab="Tất cả" key="1">
                <div className="slidebar-chat">
                    <div
                        style={{
                            width: '100%',
                            height: 50,
                            padding: 4,
                        }}
                    >
                        <AutoSearch
                            onSearchSubmit={(key: string) => {
                                if (key) searchListTopicMessage(key);
                                else setListSearchTopicMessage([]);
                            }}
                            setListSearchTopicMessage={setListSearchTopicMessage}
                            isSearchMode={isSearchMode}
                            isSearchLoading={isSearchLoading}
                            placeholder="Tìm kiếm..."
                            onFocus={() => setIsSearchMode(true)}
                            onBlur={() => setIsSearchMode(false)}
                        />
                        <hr style={{ width: '100%', color: 'gainsboro' }} />
                    </div>
                    {isSearchMode ? (
                        // search mode
                        <div className="scroll-list" id="infiniteListTopic">
                            {isSearchLoading ? (
                                <Spin
                                    style={{
                                        marginTop: '50%',
                                        width: '100%',
                                        textAlign: 'center',
                                    }}
                                    tip="Đang tải..."
                                    size="large"
                                />
                            ) : (
                                listSearchTopicMessage?.map((item, index: number) => (
                                    <TopicChatItem
                                        checkIsRead={checkIsRead}
                                        dataItem={item}
                                        item={item}
                                        key={index}
                                        id={item?.id ? item?.id : 'default_id'}
                                        count_message_not_read={
                                            item?.messages?.[0]?.users.length > 0
                                                ? item?.messages?.[0]?.users?.[0]?.messagesUsers?.isRead
                                                : true
                                        }
                                        Message={item?.messages?.[0] || null}
                                        Shop={item?.Shop}
                                        User={item?.User}
                                        time_last_send={item?.updatedAt}
                                        index={index}
                                        mode={MODE_MESSAGE?.SEARCH}
                                        onReadMessage={() => onReadMessageNew(item?.id)}
                                    />
                                ))
                            )}
                        </div>
                    ) : (
                        // default mode

                        <div className="scroll-list" id="infiniteListTopic">
                            {isLoadingFirstTime ? (
                                <Spin
                                    style={{
                                        marginTop: '50%',
                                        width: '100%',
                                        textAlign: 'center',
                                    }}
                                    tip="Đang tải..."
                                    size="large"
                                />
                            ) : listTopicMessage.length > 0 ? (
                                listTopicMessage?.map((item, index: number) => {
                                    if (item) {
                                        return (
                                            <TopicChatItem
                                                checkIsRead={checkIsRead}
                                                dataItem={item}
                                                key={index}
                                                id={item?.id ? item?.id : uuid()}
                                                Message={item?.messages?.[0] || null}
                                                count_message_not_read={
                                                    item?.messages?.[0]?.users.length > 0
                                                        ? item?.messages?.[0]?.users?.[0]?.messagesUsers?.isRead
                                                        : true
                                                }
                                                time_last_send={item?.updatedAt}
                                                index={index}
                                                mode={MODE_MESSAGE?.DEFAULT}
                                                onReadMessage={() => onReadMessageNew(item?.id)}
                                            />
                                        );
                                    }
                                })
                            ) : (
                                <p
                                    style={{
                                        width: '100%',
                                        textAlign: 'center',
                                        marginTop: 25,
                                        color: 'gray',
                                        fontWeight: 'bold',
                                        userSelect: 'none',
                                    }}
                                >
                                    Chưa có cuộc hội thoại nào
                                </p>
                            )}
                            {/* {isLoadingMore && (
                                <div style={{ width: '90%', marginLeft: '5%', marginTop: 0 }}>
                                    <Skeleton
                                        loading={true}
                                        active
                                        avatar
                                        paragraph={{ rows: 1, width: '100%' }}
                                        title={{ width: '100%' }}
                                    />
                                </div>
                            )} */}
                        </div>
                    )}
                </div>
            </CustomTabs.TabPane>
            <CustomTabs.TabPane tab="Chưa đọc" key="2">
                <div className="slidebar-chat">
                    <div
                        style={{
                            width: '100%',
                            height: 50,
                            padding: 5,
                        }}
                    >
                        <AutoSearchUnRead
                            onSearchSubmitUnRead={(key: string) => {
                                if (key) searchListTopicMessageUnRead(key);
                                else setListSearchTopicMessageUnRead([]);
                            }}
                            setListSearchTopicMessageUnRead={setListSearchTopicMessageUnRead}
                            isSearchModeUnRead={isSearchModeUnRead}
                            isSearchLoadingUnRead={isSearchLoadingUnRead}
                            placeholder="Tìm kiếm..."
                            onFocus={() => setIsSearchModeUnRead(true)}
                            onBlur={() => setIsSearchModeUnRead(false)}
                        />
                        <hr style={{ width: '100%', color: 'gainsboro' }} />
                    </div>
                    {isSearchModeUnRead ? (
                        // search modeisSearchLoadingUnRead
                        <div className="scroll-list">
                            {isSearchLoadingUnRead ? (
                                <Spin
                                    style={{
                                        marginTop: '50%',
                                        width: '100%',
                                        textAlign: 'center',
                                    }}
                                    tip="Đang tải..."
                                    size="large"
                                />
                            ) : (
                                listSearchTopicMessageUnRead.map((item, index: number) => {
                                    return (
                                        <TopicChatItem
                                            dataItem={item}
                                            key={index}
                                            id={item?.id ? item?.id : 'default_id'}
                                            count_message_not_read={
                                                item?.messages?.[0]?.users.length > 0
                                                    ? item?.messages?.[0]?.users?.[0]?.messagesUsers?.isRead
                                                    : true
                                            }
                                            Message={item?.messages?.[0] || null}
                                            Shop={item?.Shop}
                                            User={item?.User}
                                            time_last_send={item?.updatedAt}
                                            index={index}
                                            mode={MODE_MESSAGE?.SEARCH}
                                            onReadMessage={() => onReadMessageNew(item?.id)}
                                        />
                                    );
                                })
                            )}
                        </div>
                    ) : (
                        // default mode

                        <div className="scroll-list" id="infiniteListTopic">
                            {isLoadingFirstTime ? (
                                <Spin
                                    style={{
                                        marginTop: '50%',
                                        width: '100%',
                                        textAlign: 'center',
                                    }}
                                    tip="Đang tải..."
                                    size="large"
                                />
                            ) : listTopicMessageUnRead.length > 0 ? (
                                listTopicMessageUnRead.map((item, index: number) => {
                                    return (
                                        <TopicChatItem
                                            dataItem={item}
                                            key={index}
                                            id={item?.id ? item?.id : uuid()}
                                            Message={item?.messages?.[0] || null}
                                            count_message_not_read={
                                                checkIsNotReadMsg(item?.id) || item?.messages?.[0]?.users.length > 0
                                                    ? item?.messages?.[0]?.users?.[0]?.messagesUsers?.isRead
                                                    : true
                                            }
                                            Shop={item?.Shop}
                                            User={item?.User}
                                            time_last_send={item?.updatedAt}
                                            index={index}
                                            mode={MODE_MESSAGE.DEFAULT}
                                            onReadMessage={() => onReadMessageNew(item?.id)}
                                        />
                                    );
                                })
                            ) : (
                                <p
                                    style={{
                                        width: '100%',
                                        textAlign: 'center',
                                        marginTop: 25,
                                        color: 'gray',
                                        fontWeight: 'bold',
                                        userSelect: 'none',
                                    }}
                                >
                                    Chưa có cuộc hội thoại nào
                                </p>
                            )}
                            {isLoadingMoreUnRead && (
                                <div style={{ width: '90%', marginLeft: '5%', marginTop: 0 }}>
                                    <Skeleton
                                        loading={true}
                                        active
                                        avatar
                                        paragraph={{ rows: 1, width: '100%' }}
                                        title={{ width: '100%' }}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </CustomTabs.TabPane>
        </CustomTabs>
    );
}

const CustomTabs = styled(Tabs)`
    .ant-tabs-nav-list {
        margin-left: 20px;
    }
`;

// export default memo(SlideBar)
export default SlideBar;
