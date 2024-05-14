import { images } from '@/assets/imagesAssets';
import { routerPage } from '@/config/contants.routes';
import { SET_COUNT_NOTI } from '@/context/types';
import useCallContext from '@/hooks/useCallContext';
import { Avatar, Badge, Button, Divider, List, Row, Skeleton } from 'antd';
import moment from 'moment';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { DIARY, DOCCUMENT, HARVEST, MESAGE, PROPOSE, SEASON, TASK } from '../Socket/contants';
import { pushNotiService } from './service';

const PushNoti = ({ popoverRef, countNoti }: any) => {
    const { state, dispatch } = useCallContext();
    const [notifications, setNotifications] = React.useState<any>([]);
    const navigate: any = useNavigate();
    const [total, setTotal] = React.useState(0);
    const [page, setPage] = React.useState(1);
    const [callback, setCallback] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const FetchData = async () => {
        await pushNotiService
            .get(page)
            .then((res: any) => {
                setNotifications((prev: any) => (page === 1 ? res?.data : [...prev, ...res?.data]));
                setTotal(res?.paging?.totalItem);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    React.useEffect(() => {
        if (page !== 1) {
            setLoading(true);
        }
        FetchData();
    }, [page, countNoti]);

    React.useEffect(() => {
        setPage(3);
    }, [state.callbackNoti]);

    const loadMoreData = () => {
        if (loading) {
            return;
        }
        setPage((prev) => prev + 1);
    };

    React.useEffect(() => {
        loadMoreData();
    }, [callback]);

    const markAllAsRead = async () => {
        try {
            await pushNotiService.readAll().then(() => {
                const newList = notifications?.map((item: any) => ({ ...item, isRead: true }));
                setNotifications(newList);
                dispatch({
                    type: SET_COUNT_NOTI,
                });
                popoverRef.current?.onClick();
                setCallback(!callback);
            });
        } catch (error) {}
    };
    return (
        <div>
            {/* <Drawer placement="right" closable={false} onClose={onClose} open={open} key="bottom"> */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h4 style={{ marginTop: 8 }} className="gx-mb-3 gx-font-weight-bold">
                    Thông báo
                </h4>
                <Row style={{ alignItems: 'center' }}>
                    {!countNoti ? <a>Bạn đã đọc tất cả thông báo</a> : <a>{`${countNoti} thông báo chưa đọc`}</a>}
                    <Button
                        style={{ color: 'red' }}
                        disabled={countNoti === 0 || !countNoti}
                        type="link"
                        onClick={() => {
                            markAllAsRead();
                        }}
                    >
                        Đọc tất cả
                    </Button>
                </Row>
            </div>
            <div id="scrollableDiv" style={{ height: 'calc(100vh - 400px)', width: '400px', overflowY: 'auto' }}>
                <InfiniteScroll
                    dataLength={notifications?.length}
                    next={loadMoreData}
                    hasMore={notifications?.length < total}
                    loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                    endMessage={
                        notifications?.length > 0 ? (
                            <Divider plain></Divider>
                        ) : (
                            <Divider plain>Bạn chưa có thông báo nào</Divider>
                        )
                    }
                    scrollableTarget="scrollableDiv"
                >
                    <List
                        dataSource={notifications}
                        renderItem={(item: any) => (
                            <ListItemStyled
                                onClick={async () => {
                                    await pushNotiService.read(item?.id);

                                    if (TASK.includes(item?.type)) {
                                        navigate(routerPage.work, {
                                            state: {
                                                isFromNoti: item?.navigateId,
                                                isNameWork: item?.metadata?.taskName,
                                            },
                                            // + item?.navigateId,
                                        });
                                        popoverRef.current?.onClick();
                                    } else if (SEASON.includes(item?.type)) {
                                        navigate(routerPage.season + '/detail/' + item?.navigateId);
                                        popoverRef.current?.onClick();
                                    } else if (MESAGE.includes(item?.type)) {
                                        navigate(routerPage.chat + '/' + Number(item?.navigateId));
                                        popoverRef.current?.onClick();
                                    } else if (DOCCUMENT.includes(item?.type)) {
                                        navigate(routerPage.document);
                                        popoverRef.current?.onClick();
                                    } else if (HARVEST.includes(item?.type)) {
                                        navigate(routerPage.season + '/edit/' + Number(item?.navigateId), {
                                            state: { isFromNoti: '3' },
                                        });
                                        popoverRef.current?.onClick();
                                    } else if (DIARY.includes(item?.type)) {
                                        navigate(routerPage.season + '/edit/' + Number(item?.metadata?.seasonId), {
                                            state: { isFromNoti: '4', navigateId: Number(item?.metadata?.seasonId) },
                                        });
                                        popoverRef.current?.onClick();
                                    } else if (PROPOSE.includes(item?.type)) {
                                        navigate(routerPage.season + '/detail/' + Number(item?.navigateId), {
                                            state: { isFromNoti: '2', navigateId: Number(item?.navigateId) },
                                        });
                                        popoverRef.current?.onClick();
                                    }
                                    setNotifications((prev: any) => {
                                        return prev.map((notis: any) => {
                                            return item.id === notis.id
                                                ? {
                                                      ...notis,
                                                      isRead: true,
                                                  }
                                                : notis;
                                        });
                                    });
                                    dispatch({
                                        type: SET_COUNT_NOTI,
                                    });
                                }}
                            >
                                <List.Item.Meta
                                    avatar={
                                        item?.isRead ? (
                                            <Avatar src={images.notification} />
                                        ) : (
                                            <Badge dot color="blue">
                                                <Avatar src={images.notification} />
                                            </Badge>
                                        )
                                    }
                                    title={
                                        <Row justify="space-between" className="gx-m-0">
                                            <div style={{ fontWeight: item?.isRead ? '400' : 'bold' }}>
                                                {item?.title}
                                            </div>
                                            <div
                                                style={{ fontWeight: item?.isRead ? '400' : 'bold', fontSize: '12px' }}
                                            >
                                                {moment(item?.createdAt).format('HH:mm DD/MM/YYYY')}
                                            </div>
                                        </Row>
                                    }
                                />
                            </ListItemStyled>
                        )}
                    />
                </InfiniteScroll>
            </div>
            {/* </Drawer> */}
        </div>
    );
};

const ListItemStyled = styled(List.Item)`
    cursor: pointer;
    &:hover {
        opacity: 0.5;
    }
`;

export default PushNoti;
