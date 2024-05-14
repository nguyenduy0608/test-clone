import LocalStorage from '@/apis/LocalStorage';
import audiobell from '@/assets/audio/sound.mp3';
import { routerPage } from '@/config/contants.routes';
import { SET_COUNT_NOTI, SET_SYNC_LOADING } from '@/context/types';
import useCallContext from '@/hooks/useCallContext';
import { notificationSync } from '@/utils/notification';
import { message } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DIARY, DOCCUMENT, HARVEST, MESAGE, PROPOSE, SEASON, TASK } from './contants';

const Socket = () => {
    const { state, dispatch } = useCallContext();
    const navigate = useNavigate();
    const audioRef: any = React.useRef();
    const userId = state?.info?.id;
    // joinUser
    React.useEffect(() => {
        if (state.socket?.connected) {
            // if (LocalStorage.getToken() && state?.info?.group !== ADMIN.news) {
            if (LocalStorage.getToken()) {
                state.socket.on(`new_notification`, (data: any) => {
                    if (TASK.includes(data?.data?.type)) {
                        notificationSync(
                            data?.data?.description,
                            data?.data?.title,
                            () =>
                                navigate(routerPage.work, {
                                    state: {
                                        isFromNoti: data?.data?.navigate_id,
                                        isNameWork: data?.data?.metadata?.task_name,
                                    },
                                }),
                            TASK.includes(data?.data?.type)
                        );
                    }
                    if (SEASON.includes(data?.data?.type)) {
                        notificationSync(
                            data?.data?.description,
                            data?.data?.title,
                            () => navigate(routerPage.season + '/detail/' + data?.data?.navigate_id),
                            SEASON.includes(data?.data?.type)
                        );
                    }
                    if (DOCCUMENT.includes(data?.data?.type)) {
                        notificationSync(
                            data?.data?.description,
                            data?.data?.title,
                            () => navigate(routerPage.document),
                            DOCCUMENT.includes(data?.data?.type)
                        );
                    }
                    if (PROPOSE.includes(data?.data?.type)) {
                        notificationSync(
                            data?.data?.description,
                            data?.data?.title,
                            () =>
                                navigate(routerPage.season + '/detail/' + Number(data?.data?.navigate_id), {
                                    state: { isFromNoti: '2', navigateId: Number(data?.data?.navigate_id) },
                                }),
                            PROPOSE.includes(data?.data?.type)
                        );
                    }
                    if (HARVEST.includes(data?.data?.type)) {
                        notificationSync(
                            data?.data?.description,
                            data?.data?.title,
                            () =>
                                navigate(routerPage.season + '/edit/' + Number(data?.data?.navigate_id), {
                                    state: { isFromNoti: '3' },
                                }),
                            HARVEST.includes(data?.data?.type)
                        );
                    }
                    if (DIARY.includes(data?.data?.type)) {
                        notificationSync(
                            data?.data?.description,
                            data?.data?.title,
                            () =>
                                navigate(routerPage.season + '/edit/' + Number(data?.data?.metadata?.season_id), {
                                    state: { isFromNoti: '4', navigateId: Number(data?.data?.metadata?.season_id) },
                                }),
                            DIARY.includes(data?.data?.type)
                        );
                    }
                    if (MESAGE.includes(data?.data?.type)) {
                        notificationSync(
                            data?.data?.description,
                            data?.data?.title,
                            () =>
                                navigate(routerPage.chat + '/' + Number(data?.data?.navigate_id), {
                                    state: {
                                        isRead: true,
                                    },
                                }),
                            MESAGE.includes(data?.data?.type)
                        );
                    }
                    setTimeout(() => {
                        dispatch({
                            type: SET_COUNT_NOTI,
                        });
                    }, 1000);
                });
            }
        }
    }, [state.socket?.connected]);

    return (
        <>
            <audio controls ref={audioRef} style={{ display: 'none' }}>
                {/* <source src={audiobell} type="audio/mp3" /> */}
            </audio>
        </>
    );
};

export default Socket;
