import React from 'react';

const LoginPage = React.lazy(() => import('@/features/Auth/Login/pages'));

import AccountantRoutes from './Accountant.routes';
import AdminRoutes from './Admin.routes';
import { routerPage } from './contants.routes';
import EditorRoutes from './Editor.routes';
import { PublicRoutes } from './Lazy.routes';

// todo: auth router khi chưa đăng nhập
const AuthRoutes = [
    {
        path: routerPage.login,
        element: <LoginPage />,
    },

    ...PublicRoutes,
];

export { AdminRoutes, AuthRoutes, EditorRoutes, AccountantRoutes };
