import { TAB_SIZE } from '@/config/theme';
import ErrorBoundary from '@/features/Error/ErrorBoundary';
import Socket from '@/features/Socket';
import useWindowSize from '@/hooks/useWindowSize';
import SideBar from '@/layout/SideBar';
import { Layout, Row } from 'antd';
import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Topbar from './Content/Topbar';
const { Content, Footer } = Layout;
const PageLayout = (PageComponent: React.JSXElementConstructor<any>) => {
    return function WithPage({ ...props }) {
        const location = useLocation();

        const [isLogin, setIsLogin] = React.useState(false);

        const { width } = useWindowSize();

        const [collapsedMobile, setCollapsedMobile] = React.useState(false);

        const handleCallbackCollapseMobile = React.useCallback(() => {
            setCollapsedMobile(!collapsedMobile);
        }, [collapsedMobile]);

        React.useLayoutEffect(() => {
            if (localStorage.getItem('token')) {
                setIsLogin(true);
            }
        }, []);

        return isLogin ? (
            <Layout className="gx-app-layout ">
                {/* sidebar */}
                {location.pathname !== '/delete-user' && (
                    <SideBar
                        collapsedMobile={collapsedMobile}
                        handleCallbackCollapseMobile={handleCallbackCollapseMobile}
                    />
                )}
                {/* content */}
                <Layout>
                    {/* top content */}
                    {width < TAB_SIZE && location.pathname !== '/delete-user' && (
                        <Topbar handleCallbackCollapseMobile={handleCallbackCollapseMobile} />
                    )}
                    {/* body content */}
                    <ErrorBoundary>
                        <Content className="gx-layout-content">
                            <div className="gx-main-content-wrapper" style={{ overflow: 'hidden' }}>
                                <PageComponent {...props} />
                            </div>
                        </Content>
                    </ErrorBoundary>
                </Layout>
                <Socket />
            </Layout>
        ) : (
            <Layout className="gx-app-layout">
                <ContainerAuthStyled justify="center" align="middle">
                    <PageComponent {...props} />
                </ContainerAuthStyled>
            </Layout>
        );
    };
};

const ContainerAuthStyled = styled(Row)`
    min-height: 100vh;
`;

export default PageLayout;
