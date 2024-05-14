import AxiosClient from '@/apis/AxiosClient';
import { RECORD_SIZE } from '@/config/theme';
import { handleObjectEmpty } from '@/utils';
import { ALL } from 'dns';
export interface IQuery {
    page: number;
    name?: string;
    category_id?: number;
    status?: number | string;
    limit?: number;
    fromDate?: string;
    toDate?: string;
}
export const ConfigService = {
    get: (params: IQuery) => {
        const url = `/configs/units`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, {
            params: { ...handleParams, limit: RECORD_SIZE, sortBy: 'created_at', sortOrder: 'desc' },
        });
    },
    create: (data: any) => {
        const url = `/configs/units`;
        return AxiosClient.post(url, data);
    },
    update: (data: any) => {
        const url = `/configs/units`;
        return AxiosClient.put(url, data);
    },
    delete: (id: string) => {
        const url = `/configs/units/${id}`;
        return AxiosClient.delete(url);
    },
    unlock: (id: number) => {
        const url = `/category/${id}/active`;
        return AxiosClient.patch(url);
    },
    lock: (id: number) => {
        const url = `/category/${id}/inactive`;
        return AxiosClient.patch(url);
    },
    changeStatus: (id: number, status: boolean) => {
        const url = status ? `/category/${id}/toggleActive` : `/category/${id}/toggleActive`;
        return AxiosClient.put(url);
    },
    //thời gian
    getTimes: () => {
        const url = `/configs/times`;
        return AxiosClient.get(url);
    },
    updateTimes: (data: any) => {
        const url = `/configs/times`;
        return AxiosClient.put(url, data);
    },
};
