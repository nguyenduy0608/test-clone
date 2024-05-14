import AxiosClient from '@/apis/AxiosClient';
import { RECORD_SIZE } from '@/config/theme';
import { handleObjectEmpty } from '@/utils';

import { DataTypeAccount } from '../component/Account.Config';
import { AnyListenerPredicate } from '@reduxjs/toolkit';
export interface IQuery {
    page: number;
}

const accountService = {
    get: (params: IQuery) => {
        const url = `/users`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, {
            params: { ...handleParams, limit: RECORD_SIZE, sortBy: 'created_at', sortOrder: 'desc' },
        });
    },
    getOldPass: (params: any) => {
        const url = `/users/me/check-password`;

        return AxiosClient.get(url, { params: { password: params } });
    },
    create: (data: DataTypeAccount) => {
        const url = `/users`;
        return AxiosClient.post(url, data);
    },

    update: (data: DataTypeAccount) => {
        const url = `/users`;
        return AxiosClient.put(url, data);
    },
    changePassWord: (data: any) => {
        const url = `/users/change-password`;
        return AxiosClient.patch(url, data);
    },

    delete: (data: any) => {
        const url = `/users/soft-delete-one`;
        return AxiosClient.delete(url, { data });
    },
    unlock: (id: number) => {
        const url = `/users/activate`;
        return AxiosClient.patch(url, { userId: id });
    },
    lock: (id: number) => {
        const url = `/users/deactivate`;
        return AxiosClient.patch(url, { userId: id });
    },
    resetPassword: (data: any) => {
        const url = `/users/reset-password`;
        return AxiosClient.patch(url, data);
    },
};

export default accountService;
