import AppLoading from './assets/appLoading.json';
import { ConfigProvider, Spin } from 'antd';
import vi_VN from 'antd/lib/locale/vi_VN';
import Lottie from 'lottie-react';
import moment from 'moment';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Snowfall from 'react-snowfall';
import styled from 'styled-components';
import LocalStorage from './apis/LocalStorage';
import ModalChangePassword from './components/ModalChangePassword';
import GlobalStyle from './config/global.style';
import { BOX_SHADOW } from './config/theme';
import { APP_LOADING, SET_BG_APP, SET_INFO, SET_SOCKET, SET_UNIT } from './context/types';
import { authService } from './features/Auth/service';
import MainPage from './features/MainPage';
import useCallContext from './hooks/useCallContext';
import { ConfigService } from './features/App/config/service';
import { io } from 'socket.io-client';

moment.utc().locale('vi');
const snowflake1 = document.createElement('img');
snowflake1.style.width = '50px';
snowflake1.style.height = '50px';
function App() {
    const { state, dispatch } = useCallContext();
    const [role, setRole] = React.useState<string>('');
    const navigate = useNavigate();
    const location = useLocation();
    // loading when going to app
    React.useEffect(() => {
        setTimeout(() => {
            dispatch({ type: APP_LOADING, payload: false });
        }, 2500);
    }, []);

    React.useLayoutEffect(() => {
        if (LocalStorage.getToken()) {
            // authService.info().then((res) => {
            setRole('admin');
            dispatch({
                type: SET_INFO,
                payload: { role: 1 },
            });
            // });
        }
        // if (LocalStorage.getToken()) {
        //     ConfigService.get({page: 1, limit: 100}).then((res) => {
        //         dispatch({
        //             type: SET_UNIT,
        //             payload: res?.data,
        //         });
        //     });
        // }
    }, []);
    React.useEffect(() => {
        if (state.info) {
            const socket = io(import.meta.env.VITE_SOCKET_URL, {
                auth: { token: LocalStorage.getToken() },
            });
            dispatch({ type: SET_SOCKET, payload: socket });
        }
    }, [state.info]);
    // setup socket to context

    return (
        <SpinLoadingStyled
            spinning={state.appLoading && location.pathname !== '/delete-user'}
            indicator={
                <ContainerLoading>
                    <div style={{ height: '600px', width: '600px' }}>
                        <Lottie animationData={AppLoading} loop={true} />
                    </div>
                </ContainerLoading>
            }
        >
            <ConfigProvider locale={vi_VN}>
                <MainPage role={role} />
                {/* <MainPage role={'admin'} /> */}
            </ConfigProvider>
            {/* define default style */}
            <GlobalStyle />
            {!state?.appBackground?.showFlower && state?.appBackground?.show && (
                <Snowfall
                    color={state?.appBackground?.color}
                    style={{
                        position: 'fixed',
                        width: '100vw',
                        height: '100vh',
                    }}
                />
            )}
            {state?.appBackground?.showFlower && state?.appBackground?.show && (
                <Snowfall
                    color={state?.appBackground?.color}
                    style={{
                        position: 'fixed',
                        width: '100vw',
                        height: '100vh',
                    }}
                    snowflakeCount={30}
                    radius={[10, 20]}
                    images={[snowflake1]}
                />
            )}
            {/* loading khi đồng bộ */}

            {/* <ModalChangePassword openModal={state?.openModalChangePassword} /> */}
        </SpinLoadingStyled>
    );
}

const SpinLoadingStyled = styled(Spin)`
    &&& {
        top: 0;
        left: 0;
    }
`;

const ContainerLoading = styled.div`
    top: 0 !important;
    margin: 0 !important;
    left: 0 !important;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
`;

const ContainerLoadingSync = styled.div`
    top: 0 !important;
    margin: 0 !important;
    left: 0 !important;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 9999;
`;

const ContainerLoad = styled.div`
    background-color: white;
    border-radius: 20px;
    box-shadow: ${BOX_SHADOW};
    padding: 40px;
    max-width: 500px;
`;

export default App;
