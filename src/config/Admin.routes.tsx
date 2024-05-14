import React from 'react';
import { routerPage } from './contants.routes';
import Lazy, { PublicRoutes } from './Lazy.routes';

const HomePage = React.lazy(() => import('@/features/App/home/page'));
const DetailBook = React.lazy(() => import('@/features/App/home/components/DetailBook'));
const CartPage = React.lazy(() => import('@/features/App/home/components/Cart'));
const OrderPage = React.lazy(() => import('@/features/App/home/components/Order'));
const AllBookPage = React.lazy(() => import('@/features/App/home/components/AllBook'));
//work
const CustomerPage = React.lazy(() => import('@/features/App/customer/page'));
const AuthorPage = React.lazy(() => import('@/features/App/author/page'));
const ProductPage = React.lazy(() => import('@/features/App/product/page'));
const ProductForm = React.lazy(() => import('@/features/App/product/page/form'));

// garden

const ReportCostPage = React.lazy(() => import('@/features/App/report/page'));
const ReportUseLandPage = React.lazy(() => import('@/features/App/report/Land/page'));
const ReportHarvestCycle = React.lazy(() => import('@/features/App/report/harvestcycle/page'));

const AccountPage = React.lazy(() => import('@/features/App/account/page'));

const AdminRoutes = [
    {
        path: routerPage.customer,
        element: (
            <Lazy>
                <CustomerPage />
            </Lazy>
        ),
    },
    {
        path: routerPage.author,
        element: (
            <Lazy>
                <AuthorPage />
            </Lazy>
        ),
    },
    {
        path: routerPage.home,
        element: (
            <Lazy>
                <HomePage />
            </Lazy>
        ),
    },
    {
        path: routerPage.detailbook,
        element: (
            <Lazy>
                <DetailBook />
            </Lazy>
        ),
    },
    {
        path: routerPage.cart,
        element: (
            <Lazy>
                <CartPage />
            </Lazy>
        ),
    },
    {
        path: routerPage.allbook,
        element: (
            <Lazy>
                <AllBookPage />
            </Lazy>
        ),
    },
    {
        path: routerPage.order,
        element: (
            <Lazy>
                <OrderPage />
            </Lazy>
        ),
    },
    {
        path: routerPage.product,
        element: (
            <Lazy>
                <ProductPage />
            </Lazy>
        ),
    },
    {
        path: routerPage.addProduct,
        element: (
            <Lazy>
                <ProductForm />
            </Lazy>
        ),
    },
    {
        path: routerPage.editProduct,
        element: (
            <Lazy>
                <ProductForm />
            </Lazy>
        ),
    },
    // Garden

    {
        path: routerPage.reportCost,
        element: (
            <Lazy>
                <ReportCostPage />
            </Lazy>
        ),
    },
    {
        path: routerPage.reportUseLand,
        element: (
            <Lazy>
                <ReportUseLandPage />
            </Lazy>
        ),
    },
    {
        path: routerPage.reportHarvestCycle,
        element: (
            <Lazy>
                <ReportHarvestCycle />
            </Lazy>
        ),
    },
    // account
    {
        path: routerPage.account,
        element: (
            <Lazy>
                <AccountPage />
            </Lazy>
        ),
    },
    // document

    //giới thiệu
    ...PublicRoutes,
];

export default AdminRoutes;
