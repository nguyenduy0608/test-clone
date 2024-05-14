import { images } from '@/assets/imagesAssets';
import { routerPage } from '@/config/contants.routes';
import { TAB_SIZE } from '@/config/theme';
import { IS_READ } from '@/contants';
import useCallContext from '@/hooks/useCallContext';
import useWindowSize from '@/hooks/useWindowSize';
import { momentToStringDate, splitTextEndLine } from '@/utils';
import { Avatar, Col, Row } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { setChattingUser } from '../slices/MessageNotReadSlice';
import { UserInfoState } from '../types';
import './css/styles.css';

export interface TopicChatItemProps {
    dataItem: any;
    id: any;
    checkIsRead?: any;
    Message: any;
    Shop?: any;
    User?: any;
    time_last_send: Date;
    index: number;
    count_message_not_read: boolean;
    mode: number;
    onReadMessage: any;
    item?: any;
}

function TopicChatItem({
    checkIsRead,
    dataItem,
    id,
    Message,
    User,
    time_last_send,
    count_message_not_read,
    onReadMessage,
    item,
}: TopicChatItemProps) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { width } = useWindowSize();
    const pathname = location.pathname;
    const { userInfo } = useSelector((state: any) => state.authReducer);
    const { state } = useCallContext();
    const [userDisplay, setUserDisplay] = useState<UserInfoState | null>(null);
    const [isRead, setIsRead] = React.useState<boolean>(count_message_not_read);
    const split_pathname: Array<string> = pathname.split('/');
    const topic_message_id: string | undefined = split_pathname[split_pathname.length - 1];
    let message: string = Message?.content || '';

    if (message) {
        const arrMgs: Array<string> = splitTextEndLine(message);
        message = '';
        arrMgs.forEach((e: string, i) => (message += i !== arrMgs.length - 1 ? e + ' ' : e));
    }
    React.useEffect(() => {
        setIsRead(count_message_not_read);
    }, [Message]);
    const mgs = useMemo(() => {
        let message: string = Message?.content || '';
        if (message) {
            const arrMgs: Array<string> = splitTextEndLine(message);
            message = '';
            arrMgs.forEach((e: string, i) => (message += i !== arrMgs.length - 1 ? e + ' ' : e));
        }

        // Tin nhắn cuối là mình nhắn
        return Message && state?.info?.id === Message?.account_id
            ? message
                ? `Bạn: ${message}`
                : 'Bạn: Đã gửi một media.'
            : // Tin nhắn người khách nhắn: nếu message có -> message, nếu message_media_url -> Hình ảnh
            message
            ? message
            : Message?.video
            ? `Video`
            : Message?.image
            ? `Hình ảnh`
            : 'Bắt đầu cuộc trò chuyện';
    }, [state.info, Message]);

    const is_read_mgs =
        Message?.is_read === IS_READ.READ ||
        userInfo?.admin?.id === Message?.user_id ||
        userInfo?.shop_id === Message?.shop_id;

    useEffect(() => {
        if (state.info) {
            setUserDisplay(state.info);
            // setIsRead(location?.state?.isRead);
        }
    }, [state.info]);

    return (
        <RowStyled
            className={
                topic_message_id && parseInt(topic_message_id) === id ? 'chat-item active-chat-item' : 'chat-item'
            }
            onClick={() => {
                onReadMessage();
                dispatch(setChattingUser(User));
                setIsRead(true);
                navigate(`${routerPage.chat}/${id}`, { replace: true });
            }}
        >
            <Col lg={4} md={8} xs={width <= TAB_SIZE ? 4 : 24}>
                <Row justify="center">
                    <div
                        style={{
                            position: 'relative',
                        }}
                    >
                        {!isRead ? (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 10,
                                    left: 22,
                                    width: 10,
                                    height: 10,
                                    zIndex: 1,
                                    borderRadius: '50%',
                                    border: 2,
                                    backgroundColor: '#be0000',
                                    color: 'white',
                                    fontSize: 'x-small',
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    verticalAlign: 'top',
                                }}
                            />
                        ) : (
                            <></>
                        )}

                        <Avatar
                            size={60}
                            // src={Message?.image}
                            icon={<img src={images.logoSideBar} />}
                            style={{ border: '2px solid #f2f1f0', marginLeft: 20 }}
                        />
                    </div>
                </Row>
            </Col>
            <Col lg={11} md={14} xs={width <= TAB_SIZE ? 12 : 0} style={{ height: '100%', marginLeft: 22 }}>
                <Row align="middle" style={{ height: '100%' }}>
                    <Col span={24} style={{ height: '80%' }}>
                        <Row>
                            <strong
                                style={{
                                    marginTop: '6px',
                                    fontSize: 16,
                                    whiteSpace: 'nowrap',
                                    width: '100%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {dataItem?.name}
                                {/* <p style={{ fontSize: 10, fontWeight: 300 }}>{dataItem?.description}</p> */}
                            </strong>
                        </Row>
                        <Row>
                            {is_read_mgs ? (
                                <p
                                    style={{
                                        marginTop: '4px',
                                        whiteSpace: 'nowrap',
                                        width: '100%',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        color: '#515151',
                                        fontSize: 14,
                                        fontWeight: '500',
                                    }}
                                >
                                    {mgs}
                                </p>
                            ) : (
                                <p
                                    style={{
                                        marginTop: 8,
                                        whiteSpace: 'nowrap',
                                        width: '100%',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        color: '#515151',
                                        fontSize: 14,
                                    }}
                                >
                                    <strong>{mgs}</strong>
                                </p>
                            )}
                        </Row>
                    </Col>
                </Row>
            </Col>
            <Col lg={4} md={0} xs={0} style={{ height: '85%', marginTop: 16 }}>
                {dataItem?.messages?.length > 0 ? (
                    <span style={{ fontSize: 10, color: 'gray' }}>{momentToStringDate(Message?.createdAt)}</span>
                ) : (
                    <span style={{ fontSize: 11, color: 'green' }}>Mới</span>
                )}
            </Col>
        </RowStyled>
    );
}
export default TopicChatItem;

const RowStyled = styled(Row)`
    margin-left: 0 !important;
`;
