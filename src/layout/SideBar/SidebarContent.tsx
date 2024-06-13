import logo_sidebar from '@/assets/images/logo_sidebar.png';
import CustomScrollbars from '@/components/CustomScrollbars';
import UserInfo from '@/components/UserInfo';
import { GREEN, MAINBACKGROUND, TAB_SIZE } from '@/config/theme';
import useCallContext from '@/hooks/useCallContext';
import useWindowSize from '@/hooks/useWindowSize';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Menu, Row } from 'antd';
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { itemsAdmin } from './Sidebar.Menu';
import { switchSidebar } from './contants';

const SidebarContent = ({
    collapsed,
    handleCallbackCollapsed,
}: {
    collapsed?: boolean;
    handleCallbackCollapsed?: () => void;
}) => {
    const { state } = useCallContext();

    const location = useLocation();
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const selectedKeys = location.pathname?.substr(1)?.includes('order') ? 'order' : location.pathname.substr(1) || '/';
    return (
        <>
            <Row
                align="middle"
                className="gx-m-0 gx-layout-sider-header"
                style={{ backgroundColor: '#ffff', padding: '0' }}
            >
                {!collapsed ? (
                    <Link
                        className=" gx-pointer"
                        to="/"
                        style={{ textAlign: 'center', width: '100%', display: 'flex', justifyContent: 'center' }}
                    >
                        <span
                            style={{
                                display: 'flex',
                                // flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <span
                                style={{
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    color: '#14B858',
                                    marginLeft: '10px',
                                }}
                            >
                                VŨ TRỤ TRI THỨC
                            </span>
                            <img
                                height="50px"
                                width="70px"
                                // style={{ objectFit: 'contain', padding: '30px 30px' }}
                                alt="logo_sidebar"
                                src={logo_sidebar}
                            />
                        </span>
                    </Link>
                ) : (
                    <Link className="gx-d-block gx-pointer" to="/" style={{ textAlign: 'center', width: '100%' }}>
                        <span
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <img
                                height="50px"
                                width="70px"
                                // style={{ objectFit: 'contain', padding: '30px 30px' }}
                                alt="logo_sidebar"
                                src={logo_sidebar}
                            />
                        </span>
                    </Link>
                )}
            </Row>
            <div className="gx-sidebar-content">
                {/* top sidebar */}
                <div
                    className={width > TAB_SIZE ? 'gx-sidebar-notifications gx-pb-5 gx-pb-5' : ''}
                    style={
                        width < TAB_SIZE
                            ? { padding: '10px 0 5px 24px', width: '100%', backgroundColor: MAINBACKGROUND }
                            : { width: '85%', borderBottomColor: GREEN }
                    }
                >
                    {/* user info */}
                    <UserInfo />
                </div>

                {/* sidebar menu */}
                <CustomScrollbars className="gx-layout-sider-scrollbar">
                    <div className="gx-menu-group">
                        <MenuStyled
                            // defaultOpenKeys={switchSidebar(state?.info?.dfTypeUserId).map((item: { key: string }) => item.key)}
                            selectedKeys={[selectedKeys]}
                            mode="inline"
                            style={{ color: '#fff' }}
                            items={switchSidebar('admin')}
                            // items={itemsAdmin}
                            theme={MAINBACKGROUND}
                            // items={itemsAdmin}
                            onClick={(e) => navigate(e.key === '/' ? e.key : '/' + e.key)}
                        />
                    </div>
                    <div
                        className="gx-linebar"
                        style={{ position: 'absolute', bottom: '0', right: '50%' }}
                        onClick={handleCallbackCollapsed}
                    >
                        {collapsed ? (
                            <MenuUnfoldOutlined className="gx-icon-btn" style={{ color: 'black' }} />
                        ) : (
                            <MenuFoldOutlined className="gx-icon-btn" style={{ color: 'black' }} />
                        )}
                    </div>
                </CustomScrollbars>
            </div>
        </>
    );
};

const MenuStyled = styled(Menu)`
    * {
        font-weight: 600;
    }
    ul {
        color: black;
        background-color: #ffff;
    }
    li {
        background: #ffff !important;
        color: black;
    }
    div {
        background: #ffff !important;
        color: black !important;
    }
`;

export default React.memo(SidebarContent);
