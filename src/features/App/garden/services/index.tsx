import AxiosClient from '@/apis/AxiosClient';
import { RECORD_SIZE } from '@/config/theme';
import { handleObjectEmpty } from '@/utils';

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
    acreage: number;
    address: string;
    name: string;
    areas: areas[];
    sid: string;
    gardenId?: number;
}

export const gardenService = {
    get: (params: IQuery) => {
        const url = `/gardens`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, { params: { ...handleParams, limit: RECORD_SIZE, sortBy: 'created_at', sortOrder: 'desc' } });
    },
    create: (data: DataType) => {
        const url = `/gardens`;
        return AxiosClient.post(url, data);
    },
    update: (data: DataType) => {
        const url = `/gardens`;
        return AxiosClient.put(url, data);
    },
    detail: (id: number, params?: any) => {
        const url = `/gardens/${id}`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, { params: { ...handleParams } });
    },
    detailPlantbeds: (id: number, params: IQuery) => {
        const url = `/gardens/plantbeds/${id}`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, { params: { ...handleParams, limit: RECORD_SIZE } });
    },
    detailArea: (id: number, params: IQuery) => {
        const url = `/gardens/general-infor/${id}`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, { params: { ...handleParams, limit: RECORD_SIZE } });
    },
    detailUser: (id: number, params: IQuery) => {
        const url = `/gardens/users/${id}`;
        const handleParams = handleObjectEmpty(params);
        return AxiosClient.get(url, { params: { ...handleParams, limit: RECORD_SIZE } });
    },
    delete: (data: any) => {
        const url = `/gardens/soft-delete-one`;
        return AxiosClient.delete(url, { data });
    },
    unlock: (id: number) => {
        const url = `/gardens/activate`;
        return AxiosClient.patch(url, { gardenId: id });
    },
    lock: (id: number) => {
        const url = `/gardens/deactivate`;
        return AxiosClient.patch(url, { gardenId: id });
    },

    //note
    note: (data: {gardenId: number, content: string}) => {
        const url = `/gardens/note`;
        return AxiosClient.patch(url, data);
    },
};
