import LocalStorage from '@/apis/LocalStorage';
import useCallContext from '@/hooks/useCallContext';
import { DownOutlined } from '@ant-design/icons';
import { Avatar, Badge, Form, Popconfirm, Popover, Row } from 'antd';
import React from 'react';
import IconAntd from '../IconAntd';
import { appService } from '@/service';
import Clock from 'react-live-clock';
import styled from 'styled-components';
import { images } from '@/assets/imagesAssets';
import PushNoti from '@/features/pushNoti';
import AxiosClient from '@/apis/AxiosClient';
import { useDispatch, useSelector } from 'react-redux';
import { setNotiCount } from '@/redux/slice/NotificationSlice';
import ResetPassModal from './ResetPassForm';
const initialValue = {
    fullName: '',
    email: '',
    avatar: '',
};

const UserInfo = () => {
    const { state } = useCallContext();
    const notiData = useSelector((state: any) => state.notificationReducer?.noti_count);
    const popoverRef = React.useRef(null);
    const [countNoti, setCountNoti] = React.useState<any>(0);
    const [modalVisible, setModalVisible] = React.useState(false);

    const dispatch = useDispatch();
    const [form] = Form.useForm();

    React.useEffect(() => {
        appService.getCountNoti().then((res: any) => {
            setCountNoti(res.data);
            dispatch(setNotiCount(res.data));
        });
    }, [state.callbackNoti]);
    const userMenuOptions = (
        <ul className="gx-user-popover">
            <li onClick={() => setModalVisible(true)} className="gx-font-weight-medium">
                Đổi mật khẩu
            </li>
            <Popconfirm
                title={<strong style={{ marginTop: '10px' }}>Bạn chắc chắn muốn đăng xuất tài khoản này?</strong>}
                onConfirm={async () => {
                    const res = await AxiosClient.delete('/auth/logout');
                    // if(res.status)
                    LocalStorage.removeToken();
                    window.location.reload();
                }}
                okText="Ok"
                cancelText="Hủy"
                okButtonProps={{
                    // type: 'primary',
                    style: { background: '#f79420 !important', color: 'white !important', border: 'none' },
                }}
            >
                <li className="gx-font-weight-medium">Đăng xuất</li>
            </Popconfirm>
        </ul>
    );

    const handleCloseForm = React.useCallback((trick = '') => {
        setModalVisible(false);
        if (trick === 'notRefresh') return;
        form.setFieldsValue(initialValue);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Row wrap={false} justify="center" className="gx-avatar-row gx-m-0">
                <Popover placement="bottomRight" content={userMenuOptions}>
                    <Avatar
                        src={state?.info?.avatar ? state?.info?.avatar : images.logoSideBar}
                        className="gx-size-40 gx-pointer gx-mr-3"
                        alt=""
                    />
                    <span className="gx-avatar-name gx-font-weight-bold" style={{ color: 'black' }}>
                        {state?.info?.fullName ? state?.info?.fullName : 'ADMIN'}
                        <DownOutlined className="gx-fs-sm gx-ml-4" />
                    </span>
                </Popover>
            </Row>
            <ResetPassModal modalVisible={modalVisible} handleCloseForm={handleCloseForm} />

            <Row
                justify="start"
                align="middle"
                className="gx-app-nav"
                style={{ marginTop: '15px', justifyContent: 'center' }}
            >
                <ClockStyled>
                    <Clock format="hh:mm:ss a" ticking />
                </ClockStyled>
            </Row>
        </>
    );
};

const ClockStyled = styled.li`
    border-radius: 10px;
    width: 140px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30px;
    background: linear-gradient(to right, #ffff, #ffff);
    border: 1px dashed #ccc;
    & * {
        font-size: 1.6rem;
        font-weight: 700;
        color: black;
    }
`;

export default React.memo(UserInfo);
