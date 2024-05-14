import AxiosClient from '@/apis/AxiosClient';
import { RECORD_SIZE } from '@/config/theme';
import { handleObjectEmpty } from '@/utils';
import { identity } from 'lodash';

export interface IQuery {
    page: number;
}

export interface plant {
    plantbedId?: any;
    sid: string;
    name: string;
    id?: any;
    index: number;
}

export interface areas {
    id?: any;
    areaId?: any;
    sid: string;
    name: string;
    acreage: number;
    plantbeds: plant[];
    index: number;
}
export interface DataType {
    address?: string;
    name?: string;
    phoneNumber?: string;
}

export const customerServices = {
    get: (params: IQuery) => {
        const url = `/tasks`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, {
            params: { ...handleParams, limit: RECORD_SIZE, sortBy: 'created_at', sortOrder: 'desc' },
        });
    },
    delete: (id: number | string) => {
        const url = `/tasks/web/create-one/${id}`;
        return AxiosClient.delete(url);
    },
    update: (data: DataType, id: number | string) => {
        const url = `/tasks/web/update-one/${id}`;
        return AxiosClient.put(url, data);
    },
    post: (data: DataType) => {
        const url = `/tasks/web/update-one`;
        return AxiosClient.post(url, data);
    },
};
