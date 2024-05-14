import { images } from '@/assets/imagesAssets';
import PushNoti from '@/features/pushNoti';
import useCallContext from '@/hooks/useCallContext';
import { setNotiCount } from '@/redux/slice/NotificationSlice';
import { appService } from '@/service';
import { BellOutlined, MenuOutlined } from '@ant-design/icons';
import { Badge, Layout, Popover } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Topbar = ({ handleCallbackCollapseMobile }: { handleCallbackCollapseMobile: () => void }) => {
    const { state } = useCallContext();
    const notiData = useSelector((state: any) => state.notificationReducer?.noti_count);
    const popoverRef = React.useRef(null);
    const [countNoti, setCountNoti] = React.useState<any>(0);
    const dispatch = useDispatch();
    React.useEffect(() => {
        appService.getCountNoti().then((res: any) => {
            setCountNoti(res.data);
            dispatch(setNotiCount(res.data));
        });
    }, [state.callbackNoti]);

    return (
        <>
            <Layout.Header>
                <div className="gx-linebar gx-mr-3">
                    <MenuOutlined
                        className="gx-icon-btn"
                        // style={{ color: COLOR }}
                        onClick={handleCallbackCollapseMobile}
                    />
                </div>
                <Link className="gx-d-block gx-d-lg-none gx-pointer" to="/">
                    <img height={50} alt="" src={images.logoSideBar} />
                </Link>
                <ul className="gx-header-notifications gx-ml-auto">
                    <li className="gx-notify">
                        <Popover
                            overlayClassName="gx-popover-horizantal"
                            placement="bottomRight"
                            content={
                                <PushNoti
                                    countNoti={typeof countNoti === 'number' ? countNoti : 0}
                                    popoverRef={popoverRef}
                                />
                            }
                            trigger="click"
                        >
                            <Badge
                                overflowCount={countNoti > 999 ? 999 : 99}
                                showZero
                                count={typeof countNoti === 'number' ? countNoti : 0 || 0}
                            >
                                <span className="gx-pointer gx-d-block">
                                    <BellOutlined style={{ fontSize: '24px' }} />
                                </span>
                            </Badge>
                        </Popover>
                    </li>
                </ul>
            </Layout.Header>
        </>
    );
};

export default Topbar;
