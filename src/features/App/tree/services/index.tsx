import AxiosClient from '@/apis/AxiosClient';
import { RECORD_SIZE } from '@/config/theme';
import { handleObjectEmpty } from '@/utils';

export interface IQuery {
    page: number;
}

export interface DataType {
    flowerId: number;
    name: string;
    thumbnail: string;
    description?: string;
    sid: string;
    type: string;
}

export const flowerService = {
    get: (params: IQuery) => {
        const url = `/flowers`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, { params: { ...handleParams, limit: RECORD_SIZE, sortBy: 'created_at', sortOrder: 'desc' } });
    },
    create: (data: DataType) => {
        const url = `/flowers`;
        return AxiosClient.post(url, data);
    },
    update: (data: DataType) => {
        const url = `/flowers`;
        return AxiosClient.put(url, data);
    },
    detail: (id: number, params?: any) => {
        const url = `/flowers/${id}`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, { params: { ...handleParams } });
    },
    detailPlantbeds: (id: number, include: string, params: IQuery) => {
        const url = `/flowers/more-infor/${id}/${include}`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, { params: { ...handleParams, limit: RECORD_SIZE } });
    },
    delete: (data: any) => {
        const url = `/flowers/soft-delete-one`;
        return AxiosClient.delete(url, { data });
    },
    unlock: (id: number) => {
        const url = `/flowers/activate`;
        return AxiosClient.patch(url, { flowerId: id });
    },
    lock: (id: number) => {
        const url = `/flowers/deactivate`;
        return AxiosClient.patch(url, { flowerId: id });
    },
    checkExitsFlower: async (search: string) => {
        const url = `/flowers`;
        const res = await AxiosClient.get(url, { params: { search: search } });
        if (res.status && res.data?.length > 0) {
            return true;
        }

        return false;
    },
};
