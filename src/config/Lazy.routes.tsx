import { Suspense } from 'react';
import { BarLoader } from 'react-spinners';
import NotFoundPage from '@/features/Notfound';
import { routerPage } from './contants.routes';
import RedirectToApp from '@/features/Webview';

// public chứa những router không cần đăng nhập hoặc web view
export const PublicRoutes = [
    { path: '*', element: <NotFoundPage /> },
    {
        path: routerPage.deleteUser,
        element: <RedirectToApp />,
    },
];

const Lazy = ({ children }: { children: any }) => {
    return (
        <Suspense
            fallback={
                <div
                    style={{
                        height: '100vh',
                        width: '100%',
                        backgroundColor: 'rgba(0,0,0,.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <BarLoader />
                </div>
            }
        >
            {children}
        </Suspense>
    );
};

export default Lazy;
