import { routerPage } from '@/config/contants.routes';
import { PublicRoutes } from '@/config/Lazy.routes';
import { AccountantRoutes, AdminRoutes, AuthRoutes, EditorRoutes } from '@/config/routes';
import { ROLE } from '@/contants';
import PageLayout from '@/layout';
import { switchSidebar } from '@/layout/SideBar/contants';
import React from 'react';
import { useLocation, useNavigate, useRoutes } from 'react-router-dom';
import LocalStorage from '../apis/LocalStorage';
import ManageStorageRoutes from '@/config/ManageStorage.routes';
import ManagePolicyRoutes from '@/config/ManagePolicy.routes';
import jwtDecode from 'jwt-decode';
const switchRoute = (role: string) => {
    switch (role) {
        case ROLE.ROOT_ADMIN:
            return AdminRoutes;
        default:
            return PublicRoutes;
    }
};

// config routes
const MainPage = ({ role }: { role: string }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    let element = useRoutes(LocalStorage.getToken() ? switchRoute(role) : AuthRoutes);
    const [logged, setLogged] = React.useState(false);

    React.useEffect(() => {
        if (!role) return;
    }, [role]);
    React.useEffect(() => {
        if (logged || pathname.includes('/delete-user')) return;

        // nếu đăng nhập và domain không webview và domain không public
        // if (LocalStorage.getToken() && pathname.includes('webview') && pathname.includes('public')) {
        if (LocalStorage.getToken()) {
            setLogged(true);
            if (pathname === routerPage.register || pathname === routerPage.login) {
                switchSidebar(role);
                navigate('/home');
            }
        } else {
            switch (pathname) {
                case routerPage.register:
                    navigate(routerPage.register);
                    break;
                case routerPage.deleteUser:
                    navigate(routerPage.deleteUser);
                    break;
                default:
                    navigate(routerPage.login);
                    break;
            }
        }
    }, [logged, pathname, role]);

    return element;
};

export default PageLayout(MainPage);
